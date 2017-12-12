import * as Router from "koa-router";

import { ErrorResponse } from "../../common/ErrorResponse";
import { Privilege } from "../../common/Privilege";
import { DAL } from "../DataAccessLayer";
import { Methods, RouteDefinition } from "./RouteDefinition";

export namespace LeagueRouter {
    export const basePath = "/api/leagues";
    export const routes: RouteDefinition[] = [
        {
            path: `${LeagueRouter.basePath}/:key`,
            method: Methods.GET,
            middleware: async (context: Router.IRouterContext) => {
                try {
                    const userKey = context.state.user ? context.state.user.key : undefined;
                    if (!userKey) {
                        throw new Error("invalid-auth");
                    }
                    const user = await DAL.Users.getByKey(userKey);
                    if (!user) {
                        throw new Error("invalid-user");
                    }
                    const key = context.params.key;
                    const league = await DAL.Leagues.getLeague(key);
                    if (league) {
                        const leaguePrivilege = await DAL.Memberships.getUserPrivilege(user, league);
                        if (leaguePrivilege === Privilege.DENIED) {
                            context.throw(401, `Not authorized to view league`);
                        } else {
                            context.body = JSON.stringify(league.dto);
                        }
                    } else {
                        context.throw(404, `No league found with key ${key}`);
                    }
                } catch (exception) {
                    const resp: ErrorResponse = {
                        message: exception.message,
                        stack: exception.stack,
                    };
                    context.throw(400, JSON.stringify(resp));
                }
            },
        },
        {
            path: LeagueRouter.basePath,
            method: Methods.GET,
            middleware: async (context: Router.IRouterContext, next: () => Promise<any>) => {
                try {
                    const userKey = context.state.user ? context.state.user.key : undefined;
                    if (!userKey) {
                        throw new Error("invalid-auth");
                    }
                    console.time("user");
                    const user = await DAL.Users.getByKey(userKey);
                    console.timeEnd("user");
                    if (!user) {
                        throw new Error("invalid-user");
                    }
                    console.time("privileges");
                    const leaguePrivileges = await DAL.Memberships.getLeaguePrivileges(user);
                    const leagueKeys = leaguePrivileges
                        .filter((lp) => lp.privilege !== Privilege.DENIED).map((lp) => lp.leagueKey);
                    console.timeEnd("privileges");
                    console.time("leagues");
                    const leagues = await DAL.Leagues.getLeagues(leagueKeys);
                    console.timeEnd("leagues");
                    const leagueDTOs = leagues.map((league) => league.dto);
                    context.body = JSON.stringify(leagueDTOs);
                } catch (exception) {
                    const resp: ErrorResponse = {
                        message: exception.message,
                        stack: exception.stack,
                    };
                    context.throw(400, JSON.stringify(resp));
                }
            },
        },
        {
            path: LeagueRouter.basePath,
            method: Methods.POST,
            middleware: async (context: Router.IRouterContext) => {
                try {
                    const leagueDTO = context.request.body;
                    await DAL.Leagues.addLeague(leagueDTO);
                    await DAL.save();
                    context.body = JSON.stringify({ success: true });
                } catch (error) {
                    const resp: ErrorResponse = {
                        message: error.message,
                        stack: error.stack,
                    };
                    context.throw(400, JSON.stringify(resp));
                }
            },
        },
    ];
}
