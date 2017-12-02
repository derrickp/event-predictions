import * as Router from "koa-router";

import { ErrorResponse } from "../../common/ErrorResponse";
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
                    const key = context.params.key;
                    const league = await DAL.Leagues.getLeague(key);
                    if (league) {
                        context.body = JSON.stringify(league.dto);
                    }
                    else {
                        context.throw(404, `No league found with key ${key}`);
                    }
                } catch (exception) {
                    const resp: ErrorResponse = {
                        message: exception.message,
                        stack: exception.stack
                    };
                    context.throw(400, JSON.stringify(resp));
                }
            }
        },
        {
            path: LeagueRouter.basePath,
            method: Methods.GET,
            middleware: async (context: Router.IRouterContext, next: () => Promise<any>) => {
                try {
                    const leagues = await DAL.Leagues.getLeagues([]);
                    const leagueDTOs = leagues.map(league => league.dto);
                    context.body = JSON.stringify(leagueDTOs);
                } catch (exception) {
                    const resp: ErrorResponse = {
                        message: exception.message,
                        stack: exception.stack
                    };
                    context.throw(400, JSON.stringify(resp));
                }
            }
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
                        stack: error.stack
                    };
                    context.throw(400, JSON.stringify(resp));
                }
            }
        }
    ];
}