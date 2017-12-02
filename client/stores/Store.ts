
import { Actions } from "../Actions";
import { AppEvents } from "../AppEvents";
import * as dispatch from "../Dispatch";

import { getLeagues } from "../api/leagues";

import { LeagueDTO } from "../../common/dtos/LeagueDTO";


let token: string = "";

export function setToken(t: string) {
    token = t;
}

export async function send(action: Actions) {
    try {
        switch (action) {
            case Actions.GET_LEAGUES:
                const leagues = await getLeaguesAction();
                dispatch.publish(AppEvents.LEAGUES_FETCHED, leagues);
        }
    } catch (exception) {
        alert(exception);
    }
}

async function getLeaguesAction(): Promise<LeagueDTO[]> {
    return getLeagues(token);
}