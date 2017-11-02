
import { UserLeaguePrivilege } from "./UserLeaguePrivilege";

/**
 * A representation of a user of the predictions site.
 */
export interface User {
    id: string;
    email: string;
    display: string;
    avatar: string;
    privileges: UserLeaguePrivilege[];
    predictionIds: string[];
    pickIds: string[];
}