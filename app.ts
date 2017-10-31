import * as Koa from "koa";
import * as Router from "koa-router";
import * as serve from "koa-static";

import { PORT } from "./server/config";

const router = new Router();
const app = new Koa();

app.use(serve(__dirname + '/public'));

const port = process.env.PORT ? process.env.PORT : PORT;
console.log(`Listening on port: ${port}`);
app.listen(port);