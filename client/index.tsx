
import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./App";

const element = document.getElementById("picker-app") as HTMLElement;

export function start() {
    if ((window as any)["gapi"]) {
        console.timeEnd("picker-init");
        console.log("woohoo");
        render();
    } else {
        console.log("nope");
        setTimeout(() => {
            console.log("timeout");
            start();
        }, 10);
    }
}

export function render() {
    ReactDOM.render(<App />, element);
}
console.time("picker-init");
start();