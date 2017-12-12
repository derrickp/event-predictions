
import { AuthRouter } from "./routes/AuthRouter";
import { LeagueRouter } from "./routes/LeagueRouter";
import { RouteDefinition } from "./routes/RouteDefinition";
import { UserRouter } from "./routes/UserRouter";

export const publicRoutes: RouteDefinition[] = ([] as RouteDefinition[])
    .concat(AuthRouter.routes);

export const securedRoutes: RouteDefinition[] = ([] as RouteDefinition[])
    .concat(LeagueRouter.routes)
    .concat(UserRouter.routes);
