
import * as React from "react";
import { Route } from "react-router-dom";

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

import SignIn from "./sign-in/SignIn";
import UserManager from "./auth/UserManager";

export interface AppProps {
    history: any;
    showMain: boolean;
    loading: boolean;
    userManager: UserManager;
}
export interface AppState { }

export class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        this.clickSignIn = this.clickSignIn.bind(this);
    }

    clickSignIn() {
        this.props.history.push("/sign-in");
    }

    render() {
        const routes = !this.props.loading && [
            <Route key={"sign-in"} path="/sign-in" exact={true} render={(signInProps) => {
                return <SignIn googleAuthOptions={this.props.userManager.authOptions} />
            }} />,
            this.props.showMain && <div className={"app"} key={"hello-world"}>Hello world! It's a me! Picker App!</div>
        ];
        const signedIn = !!this.props.userManager.user;
        const rightIcon = signedIn ?
            <FlatButton label={`${this.props.userManager.user.display}`} /> :
            <FlatButton label="Sign In" onClick={this.clickSignIn} />;
        return (
            <div>
                <AppBar
                    title={<span>Title</span>}
                    iconElementRight={rightIcon}
                />
                {routes}
                {this.props.loading && <div>Loading...</div>}
            </div>
        );
    }
}