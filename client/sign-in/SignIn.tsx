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
        return [
            <div key={AUTH_ID} id={AUTH_ID}></div>
        ];
    }
}