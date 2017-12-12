import * as React from "react";

import { GoogleAuthOptions } from "../auth/GoogleAuthOptions";

export interface SignInProps {
    googleAuthOptions: GoogleAuthOptions;
}
export interface SignInState { }

const AUTH_ID = "google-auth";

export default class SignIn extends React.Component<SignInProps, SignInState> {

    componentDidMount() {
        gapi.signin2.render(AUTH_ID, this.props.googleAuthOptions);
    }

    render() {
        return (
            <div className={"sign-in-container"}>
                <div className={"sign-in sign-in-message"}>Sign in to the new prediction app!</div>
                <div className={"sign-in"} key={AUTH_ID} id={AUTH_ID}></div>
            </div>
        );
    }
}
