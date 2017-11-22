
import { UserLeaguePrivilege } from "../UserLeaguePrivilege";

export interface LeagueDTO {
    _id?: string;
    key: string;
    display: string;
    description?: string;
    greeting?: string;
    tags?: string[];
    userPrivileges: UserLeaguePrivilege[];
}