
import * as React from "react";

import { LeagueDTO } from "../../common/dtos/LeagueDTO";
import { Handle } from "../../common/Handle";
import { Actions } from "../Actions";
import { AppEvents } from "../AppEvents";
import { subscribe } from "../Dispatch";
import { send } from "../stores/Store";
import { WelcomeMessage } from "./WelcomeMessage";

export interface MainProps {
    loggedIn: boolean;
}

export interface MainState {
    leagueDTOs: LeagueDTO[];
}

export class Main extends React.Component<MainProps, MainState> {
    private _handle: Handle;

    constructor(props: MainProps) {
        super(props);
        this.state = {
            leagueDTOs: [],
        };
    }

    componentWillMount() {
        this._handle = subscribe(AppEvents.LEAGUES_FETCHED, (eventName, leagueDTOs: LeagueDTO[]) => {
            this.setState({ leagueDTOs });
        });

        if (this.props.loggedIn) {
            send(Actions.GET_LEAGUES);
        }
    }

    componentWillUnmount() {
        this._handle.remove();
        delete this._handle;
    }

    componentWillReceiveProps(newProps: MainProps) {
        if (newProps.loggedIn !== this.props.loggedIn && newProps.loggedIn) {
            send(Actions.GET_LEAGUES);
        }
    }

    render() {
        if (!this.props.loggedIn) {
            return <WelcomeMessage />;
        }
        const leagues = this.state.leagueDTOs.map((dto) => {
            return <li key={dto.key}><span>{dto.display}</span></li>;
        });
        return (
            <div>
                Hey! You're logged in! Congrats! Here are the Leagues you're a member of!
                <ul>
                    {leagues}
                </ul>
            </div>
        );
    }
}
