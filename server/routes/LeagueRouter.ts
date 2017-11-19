import * as Router from "koa-router";

import { ErrorResponse } from "../../common/ErrorResponse";
import { DBLeagueStore } from "../stores/DBLeagueStore";
import { getDb } from "../db/connection";
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
                    const db = getDb();
                    const store = new DBLeagueStore(db);
                    const league = await store.get(key);
                    context.body = JSON.stringify(league);
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
                    const db = getDb();
                    const store = new DBLeagueStore(db);
                    const leagues = await store.getMany();
                    context.body = JSON.stringify(leagues);
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
                    const league = context.request.body;
                    const db = getDb();
                    const store = new DBLeagueStore(db);
                    await store.save(league);
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