
import * as Router from "koa-router";

export interface RouteDefinition {
    method: Methods;
    path: string;
    middleware(context: Router.IRouterContext, next?: () => Promise<any>): Promise<any>;
}

export enum Methods {
    GET = "get",
    POST = "post",
}
