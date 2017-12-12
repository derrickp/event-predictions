
import { Privilege } from "./Privilege";

export interface UserLeaguePrivilege {
    leagueKey: string;
    userKey: string;
    privilege: Privilege;
}
