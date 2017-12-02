
import { LeagueDTO } from "../../../common/dtos/LeagueDTO";
import { Observable } from "../../../common/Observable";
import User from "../users/User";
import { UserLeaguePrivilege } from "../../../common/UserLeaguePrivilege";
import { Privilege } from "../../../common/Privilege";

export default class League extends Observable implements LeagueDTO {
    key: string;
    display: string;
    description?: string;
    greeting?: string;
    tags?: string[];
    userPrivileges: UserLeaguePrivilege[];

    getLeagueUsers: (keys: string[]) => Promise<{user: User, privilege: Privilege }>;

    constructor(dto: LeagueDTO) {
        super();
        this.key = dto.key;
        this.display = dto.display;
        this.description = dto.description;
        this.greeting = dto.greeting;
        this.tags = dto.tags ? dto.tags : [];
    }

    get dto(): LeagueDTO {
        return {
            key: this.key,
            display: this.display,
            description: this.description,
            greeting: this.greeting,
            tags: this.tags
        };
    }

    async getUsers() {
        const userKeys = this.userPrivileges.map(u => u.userKey);
        return this.getLeagueUsers(userKeys); 
    }
}