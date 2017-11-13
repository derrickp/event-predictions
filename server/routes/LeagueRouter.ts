import * as Router from "koa-router";
import * as mongodb from "mongodb";

import { BasicResponse } from "../../common/BasicResponse";
import { DBLeagueStore } from "../stores/DBLeagueStore";
import { getDb } from "../db/connection";
import { League } from "../../common/League";
import { Methods, RouteDefinition } from "./RouteDefinition";

export namespace LeagueRouter {
    export const basePath = "/api/leagues";
    export const ROUTES: RouteDefinition[] = [
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
                    context.throw(400, JSON.stringify(exception));
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
                    context.throw(400, JSON.stringify(exception));
                }
            }
        },
        {
            path: LeagueRouter.basePath,
            method: Methods.POST,
            middleware: async (context: Router.IRouterContext) => {
                try {
                    console.log(JSON.stringify(context.request.body));
                    const league = context.request.body;
                    const db = getDb();
                    const store = new DBLeagueStore(db);
                    await store.save(league);
                    context.body = JSON.stringify({ success: true });
                } catch (exception) {
                    context.throw(400, JSON.stringify(exception));
                }
            }
        }
    ];
}