import * as Router from "koa-router";
import * as mongodb from "mongodb";

export class AuthRouter {
    private readonly _router: Router;

    get router() {
        return this._router;
    }

    constructor() {
        this._router = new Router({
            prefix: "/authenticate"
        });

        this._setupRoutes();
    }

    private _setupRoutes() {
        this._router.post("/", (context) => {
            
        });
    }


}