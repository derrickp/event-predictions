import * as Router from "koa-router";

import { ErrorResponse } from "../../common/ErrorResponse";
import { DBUserStore } from "../stores/DBUserStore";
import { getDb } from "../db/connection";
import { Methods, RouteDefinition } from "./RouteDefinition";

export namespace UserRouter {
    export const routes: RouteDefinition[] = [
        {
            method: Methods.GET,
            path: "/api/users/my-info",
            middleware: async (context: Router.IRouterContext) => {
                try {
                    console.log(context.state.user.key)
                    const db = getDb();
                    const store = new DBUserStore(db);
                    let user = await store.get(context.state.user.key);
                    if (!user) {
                        throw new Error("user-not-found");
                    }
                    context.body = JSON.stringify(user);
                }
                catch (exception) {
                    const resp: ErrorResponse = {
                        message: exception.message,
                        stack: exception.stack
                    };
                    context.throw(400, JSON.stringify(resp));
                }
            }
        }
    ];
}