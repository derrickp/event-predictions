import * as Router from "koa-router";
import { sign } from "jsonwebtoken";

import { AuthRequest } from "../../common/AuthRequest";
import { AuthResponse } from "../../common/AuthResponse";
import { ErrorResponse } from "../../common/ErrorResponse";
import { DBLeagueStore } from "../stores/DBLeagueStore";
import { DBUserStore } from "../stores/DBUserStore";
import { getDb } from "../db/connection";
import League from "../models/League";
import { Methods, RouteDefinition } from "./RouteDefinition";
import { Privileges } from "../../common/Privileges";
import { UserDTO } from "../../common/dtos/UserDTO";
import User from "../models/User";

import { verify, GeneralAuthResponse } from "../utilities/auth";
import { LeagueDTO } from "../../common/dtos/LeagueDTO";

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
                    let userDTO = await store.getByEmail(genAuth.email);
                    if (!userDTO) {
                        const user = await signUpNewUser(genAuth, store);
                        const leagueStore = new DBLeagueStore(db);
                        const leagueDTO = await leagueStore.get("general") as LeagueDTO;
                        const league = new League(leagueDTO, leagueStore);
                        league.addUser(user, Privileges.USER);
                        await league.save();
                        userDTO = await store.getByEmail(genAuth.email) as UserDTO;
                    }
                    const secret = process.env.JWTSECRET as string;
                    const token = sign({ key: userDTO.key }, secret, { algorithm: 'HS256', expiresIn: "4h" });
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

async function signUpNewUser(genAuth: GeneralAuthResponse, store: DBUserStore): Promise<User> {
    const key = (new Buffer(genAuth.email)).toString("base64");
    const dto: UserDTO = {
        key,
        email: genAuth.email,
        display: genAuth.name,
        avatar: genAuth.picture,
        generalPrivilege: Privileges.USER
    };
    const existingUser = await store.get(key);
    if (existingUser) {
        throw new Error("user-already-exists");
    }
    const user = new User(dto, store);
    await user.save();
    return user;
}