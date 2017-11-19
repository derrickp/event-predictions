import * as Router from "koa-router";
import { sign } from "jsonwebtoken";

import { AuthRequest } from "../../common/AuthRequest";
import { AuthResponse } from "../../common/AuthResponse";
import { ErrorResponse } from "../../common/ErrorResponse";
import { DBUserStore } from "../stores/DBUserStore";
import { getDb } from "../db/connection";
import { Methods, RouteDefinition } from "./RouteDefinition";
import { Privileges } from "../../common/Privileges";
import { User } from "../../common/User";
import { UserLeaguePrivilege } from "../../common/UserLeaguePrivilege";
import { verify, GeneralAuthResponse } from "../utilities/auth";

export namespace AuthRouter {
    export const routes: RouteDefinition[] = [
        {
            method: Methods.POST,
            path: "/api/authenticate",
            middleware: async (context: Router.IRouterContext) => {
                try {
                    const authRequest: AuthRequest = context.request.body;
                    const genAuth = await verify(authRequest);
                    const db = getDb();
                    const store = new DBUserStore(db);
                    let user = await store.getByEmail(genAuth.email);
                    if (!user) {
                        await signUpNewUser(genAuth, store);
                        user = await store.getByEmail(genAuth.email) as User;
                    }
                    const secret = process.env.JWTSECRET as string;
                    const token = sign({ key: user.key }, secret, { algorithm: 'HS256', expiresIn: "4h" });
                    const response: AuthResponse = { token };
                    context.body = JSON.stringify(response);
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

async function signUpNewUser(genAuth: GeneralAuthResponse, store: DBUserStore) {
    const key = (new Buffer(genAuth.email)).toString("base64");
    const user: User = {
        key,
        email: genAuth.email,
        display: genAuth.name,
        avatar: genAuth.picture
    };
    const existingUser = await store.get(key);
    if (existingUser) {
        throw new Error("user-already-exists");
    }
    const privilege: UserLeaguePrivilege = {
        leagueId: "global",
        privilege: Privileges.USER
    };
    user.privileges = [privilege];
    await store.save(user);
}