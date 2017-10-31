
import * as React from "react";

export interface AppProps { }
export interface AppState { }

export class App extends React.Component<AppProps, AppState> {
    render() {
        return (
            <div>Hello world! It's a me! Picker App!</div>
        );
    }
}