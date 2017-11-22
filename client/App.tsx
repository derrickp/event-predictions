
import * as React from "react";
import { Route } from "react-router-dom";

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AccountCircle from "material-ui/svg-icons/action/account-circle";

import { appTitle } from "./config";
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
        this.clickSignOut = this.clickSignOut.bind(this);
        this.goToProfile = this.goToProfile.bind(this);
    }

    clickSignIn() {
        this.props.history.push("/sign-in");
    }

    clickSignOut() {
        this.props.userManager.signOut();
    }

    goToProfile() {
        this.props.history.push("/my-profile")
    }

    getSignInRoute() {
        return <Route key={"sign-in"} path="/sign-in" exact={true} render={(signInProps) => {
            return <SignIn googleAuthOptions={this.props.userManager.authOptions} />
        }} />;
    }

    getMain(showMain: boolean) {
        if (showMain) {
            return <div className={"app"} key={"hello-world"}>Hello world! It's a me! Picker App!</div>;
        }
        return null;
    }

    render() {
        const routes = !this.props.loading && [
            this.getSignInRoute(),
            this.getMain(this.props.showMain) 
        ];
        const signedIn = !!this.props.userManager.user;
        const rightIcon = signedIn ?
            <LoggedIn clickProfile={this.goToProfile} clickSignOut={this.clickSignOut} /> :
            <FlatButton label="Sign In" onClick={this.clickSignIn} />;

        return (
            <div>
                <AppBar
                    title={<span>{appTitle}</span>}
                    iconElementRight={rightIcon}
                />
                {routes}
                {this.props.loading && <div>Loading...</div>}
            </div>
        );
    }
}

interface LoggedInProps {
    clickSignOut: () => void;
    clickProfile: () => void;
}

const LoggedIn = (props: LoggedInProps) => (
    <IconMenu
      iconButtonElement={
        <IconButton><AccountCircle color="white" /></IconButton>
      }
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      <MenuItem primaryText="Profile" onClick={props.clickProfile} />
      <MenuItem primaryText="Sign out" onClick={props.clickSignOut} />
    </IconMenu>
  );