
import * as bodyParser from "koa-bodyparser";
import * as Koa from "koa";
import * as mongodb from "mongodb";
import * as Router from "koa-router";
import * as serve from "koa-static";

import { PORT } from "./server/config";

import { LeagueRouter } from "./server/routes/LeagueRouter";
import { Methods } from "./server/routes/RouteDefinition";
import { setDb } from "./server/db/connection";

export async function start() {
    const app = new Koa();
    
    app.use(bodyParser());
    app.use(serve(__dirname + '/public'));
    
    const port = process.env.PORT ? process.env.PORT : PORT;
    const mongoUri = process.env.MONGOURI;
    
    if (!mongoUri) {
        throw new Error("no database connection");
    }

    const MongoClient = mongodb.MongoClient;
    const connection = await MongoClient.connect(mongoUri);
    setDb(connection);

    const router = new Router();

    for (const route of LeagueRouter.ROUTES) {
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
    
    console.log(mongoUri);
    console.log(`Listening on port: ${port}`);
    app.listen(port);
}

start().then(() => {
    console.log("server has successfully started");
});