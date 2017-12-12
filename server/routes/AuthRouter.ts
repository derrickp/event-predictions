
import { sign } from "jsonwebtoken";
import * as Router from "koa-router";

import { AuthRequest } from "../../common/AuthRequest";
import { AuthResponse } from "../../common/AuthResponse";
import { UserDTO } from "../../common/dtos/UserDTO";
import { ErrorResponse } from "../../common/ErrorResponse";
import { Privilege } from "../../common/Privilege";
import { DAL } from "../DataAccessLayer";
import User from "../models/users/User";
import { getKeyFromEmail } from "../utilities/keys";
import { Methods, RouteDefinition } from "./RouteDefinition";

import { GeneralAuthResponse, verify } from "../utilities/auth";

export namespace AuthRouter {
    export const routes: RouteDefinition[] = [
        {
            method: Methods.POST,
            path: "/api/authenticate",
            middleware: async (context: Router.IRouterContext) => {
                try {
                    const authRequest: AuthRequest = context.request.body;
                    const genAuth = await verify(authRequest);
                    console.log(genAuth.email);
                    const user = await DAL.Users.getByEmail(genAuth.email);
                    let userDTO: UserDTO;
                    if (!user) {
                        const newUser = await signUpNewUser(genAuth);
                        // const league = DAL.leagues.getLeague("general");
                        // await league.save();
                        userDTO = newUser.dto;
                    } else {
                        userDTO = user.dto;
                    }
                    const secret = process.env.JWTSECRET as string;
                    const token = sign({ key: userDTO.key }, secret, { algorithm: "HS256", expiresIn: "4h" });
                    const response: AuthResponse = { token };
                    context.body = JSON.stringify(response);
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

async function signUpNewUser(genAuth: GeneralAuthResponse): Promise<User> {
    const key = getKeyFromEmail(genAuth.email);
    const dto: UserDTO = {
        key,
        email: genAuth.email,
        display: genAuth.name,
        avatar: genAuth.picture,
        generalPrivilege: Privilege.USER,
    };
    const existingUser = await DAL.Users.getByKey(key);
    if (existingUser) {
        throw new Error("user-already-exists");
    }
    const user = new User(dto);
    await DAL.Users.addUser(user);
    await DAL.save();
    return user;
}
