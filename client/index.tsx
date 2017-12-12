
import * as React from "react";
import * as ReactDOM from "react-dom";

import { HashRouter, Route } from "react-router-dom";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { App } from "./App";
import { AppEvents } from "./AppEvents";
import UserManager from "./auth/UserManager";
import * as dispatch from "./Dispatch";
import { setToken } from "./stores/Store";

const element = document.getElementById("picker-app") as HTMLElement;

export function start() {
    const userManager = new UserManager();

    dispatch.subscribe(AppEvents.NEW_USER, (event) => {
        setToken(userManager.token);
        render(userManager, event);
    });

    dispatch.subscribe(AppEvents.LOADING, (event) => {
        render(userManager, event);
    });

    dispatch.subscribe(AppEvents.AUTH_FAILED, (event) => {
        setToken("");
        render(userManager, event);
    });

    userManager.initialize().then(() => {
        render(userManager);
    }).catch((error: Error) => {
        console.error(error.stack);
        alert(error.message);
    });

    userManager.watch((eventName) => {
        render(userManager, eventName);
    });
}

const Container = (props: { userManager: UserManager, loading: boolean }) => {
    console.log(props.loading);
    return (
        <MuiThemeProvider>
            <HashRouter>
                <div>
                    <Route path="/" render={(appProps) => {
                        const showMain = appProps.location.pathname === "/";
                        return <App
                            userManager={props.userManager}
                            history={appProps.history}
                            showMain={showMain}
                            loading={props.loading} />;
                    }} />
                </div>
            </HashRouter>
        </MuiThemeProvider>
    );
};

export function render(userManager: UserManager, eventName?: string) {
    const loading: boolean = eventName ? eventName === AppEvents.LOADING : false;
    ReactDOM.render(<Container userManager={userManager} loading={loading} />, element);
}

const startKey = "start";
(window as any)[startKey] = start; // Set the start function on the window for the callback to the google api script
