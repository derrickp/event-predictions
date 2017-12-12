import { IRouterContext } from "koa-router";

import { ErrorResponse } from "../../common/ErrorResponse";
import { DAL } from "../DataAccessLayer";
import { Methods, RouteDefinition } from "./RouteDefinition";

export namespace UserRouter {
    export const routes: RouteDefinition[] = [
        {
            method: Methods.GET,
            path: "/api/users/my-info",
            middleware: async (context: IRouterContext) => {
                try {
                    console.log(context.state.user.key);
                    const user = await DAL.Users.getByKey(context.state.user.key);
                    if (!user) {
                        throw new Error("user-not-found");
                    }
                    context.body = JSON.stringify(user.dto);
                } catch (exception) {
                    const resp: ErrorResponse = {
                        message: exception.message,
                        stack: exception.stack,
                    };
                    context.throw(400, JSON.stringify(resp));
                }
            },
        },
    ];
}
