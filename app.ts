
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as jwt from "koa-jwt";
import * as Router from "koa-router";
import * as serve from "koa-static";
import * as mongodb from "mongodb";

import { PORT } from "./server/config";
import { setDb } from "./server/db/connection";
import { publicRoutes, securedRoutes } from "./server/routes";
import { Methods } from "./server/routes/RouteDefinition";

export async function start() {
    const secret = process.env.JWTSECRET;
    if (!secret) {
        throw new Error("no-jwt-secret-defined");
    }

    const mongoUri = process.env.MONGOURI;
    if (!mongoUri) {
        throw new Error("no-db-uri");
    }

    const app = new Koa();

    app.use(bodyParser());
    app.use(serve(__dirname + "/public"));

    const port = process.env.PORT ? process.env.PORT : PORT;

    if (!mongoUri) {
        throw new Error("no database connection");
    }

    const MongoClient = mongodb.MongoClient;
    const connection = await MongoClient.connect(mongoUri);
    setDb(connection);

    // Set up all of our public routes
    const publicRouter = new Router();
    for (const route of publicRoutes) {
        switch (route.method) {
            case Methods.GET:
                publicRouter.get(route.path, route.middleware);
                break;
            case Methods.POST:
                publicRouter.post(route.path, route.middleware);
                break;
        }
    }

    app.use(publicRouter.routes());
    app.use(publicRouter.allowedMethods());

    // Set up our jsonwebtoken middleware for the secured routes
    app.use(jwt({ secret, passthrough: true }));

    const router = new Router();
    for (const route of securedRoutes) {
        switch (route.method) {
            case Methods.GET:
                router.get(route.path, route.middleware);
                break;
            case Methods.POST:
                router.post(route.path, route.middleware);
                break;
        }
    }

    app.use(router.routes());
    app.use(router.allowedMethods());

    console.log(`Listening on port: ${port}`);
    app.listen(port);
}

start().then(() => {
    console.log("server has successfully started");
}).catch((error: Error) => {
    console.error(error.message);
});
