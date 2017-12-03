
import * as React from "react";
// import { Route } from "react-router-dom";

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AccountCircle from "material-ui/svg-icons/action/account-circle";

import { appTitle } from "./config";
import { AppDrawer } from "./app-drawer/AppDrawer";
import { Loading } from "./loading/Loading";
import { MenuItemDefinition } from "./app-drawer/MenuItemDefinition";
import { Main } from "./main/Main";
import { SignInRoute } from "./sign-in/SignInRoute";
import UserManager from "./auth/UserManager";

export interface AppProps {
    history: any;
    showMain: boolean;
    loading: boolean;
    userManager: UserManager;
}
export interface AppState {
    drawerOpen: boolean;
}

export class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        this.state = {
            drawerOpen: false
        };
        this.clickSignIn = this.clickSignIn.bind(this);
        this.clickSignOut = this.clickSignOut.bind(this);
        this.goToProfile = this.goToProfile.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.requestDrawerChange = this.requestDrawerChange.bind(this);
        this.clickMenuItem = this.clickMenuItem.bind(this);
        this.clickTitle = this.clickTitle.bind(this);
    }

    clickSignIn() {
        this.props.history.push("/sign-in");
    }

    clickSignOut() {
        this.props.userManager.signOut();
    }

    clickMenuItem(menuItem: MenuItemDefinition) {
        this.requestDrawerChange(false);

    }

    clickTitle() {
        this.props.history.push("/");
    }

    goToProfile() {
        this.props.history.push("/my-profile")
    }

    toggleDrawer() {
        const drawerOpen = !this.state.drawerOpen;
        this.setState({ drawerOpen });
    }

    requestDrawerChange(drawerOpen: boolean) {
        this.setState({ drawerOpen });
    }

    getMain(showMain: boolean) {
        if (showMain) {
            const loggedIn = this.props.userManager.user !== undefined;
            return <Main key="main" loggedIn={loggedIn} />;
        }
        return null;
    }

    render() {
        const routes = !this.props.loading && [
            <SignInRoute googleAuthOptions={this.props.userManager.authOptions} />,
            this.getMain(this.props.showMain) 
        ];
        const signedIn = !!this.props.userManager.user;
        const rightIcon = signedIn ?
            <LoggedIn clickProfile={this.goToProfile} clickSignOut={this.clickSignOut} /> :
            <FlatButton label="Sign In" onClick={this.clickSignIn} />;

        const menuItems: MenuItemDefinition[] = [
            {
                id: "leagues",
                title: "Leagues"
            },
            {
                id: "upcoming-events",
                title: "Upcoming Events"
            },
            {
                id: "manage-predictions",
                title: "Manage Predictions"
            }
        ];

        return (
            <div>
                <AppDrawer menuItems={menuItems} clickMenuItem={this.clickMenuItem} open={this.state.drawerOpen} requestOpenChange={this.requestDrawerChange} />
                <AppBar
                    title={<span>{appTitle}</span>}
                    iconElementRight={rightIcon}
                    onLeftIconButtonTouchTap={this.toggleDrawer}
                    onTitleTouchTap={this.clickTitle}
                />
                {routes}
                {this.props.loading && <Loading />}
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