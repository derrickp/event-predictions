
import * as React from "react";

import { Route } from "react-router-dom";

import SignIn, { SignInProps } from "./SignIn";

export const SignInRoute = (props: SignInProps) => {
    return <Route key={"sign-in"} path="/sign-in" exact={true} render={(signInProps) => {
        return <SignIn googleAuthOptions={props.googleAuthOptions} />;
    }} />;
};
