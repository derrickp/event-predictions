
import { UserLeaguePrivilege } from "./UserLeaguePrivilege";

/**
 * A representation of a user of the predictions site.
 */
export interface User {
    key: string;
    email: string;
    display: string;
    avatar: string;
    privileges?: UserLeaguePrivilege[];
    predictionTemplateIds?: string[];
    pickIds?: string[];
}