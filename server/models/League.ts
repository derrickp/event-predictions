
import { LeagueStore } from "../../common/stores/LeagueStore";
import { LeagueDTO } from "../../common/dtos/LeagueDTO";
import { Privileges } from "../../common/Privileges";
import { UserLeaguePrivilege } from "../../common/UserLeaguePrivilege";
import User from "./User";

export default class League implements LeagueDTO {
    key: string;
    display: string;
    description?: string;
    greeting?: string;
    tags?: string[];
    userPrivileges: UserLeaguePrivilege[];

    store: LeagueStore;

    constructor(dto: LeagueDTO, store: LeagueStore) {
        this.key = dto.key;
        this.display = dto.display;
        this.description = dto.description;
        this.greeting = dto.greeting;
        this.tags = dto.tags ? dto.tags : [];
        this.userPrivileges = dto.userPrivileges ? dto.userPrivileges : [];
    }

    addUser(user: User, privilege: Privileges) {
        const existingPrivilege = this.userPrivileges.find(p => p.userKey === user.key);
        if (existingPrivilege) {
            return;
        }
        this.userPrivileges.push({
            privilege,
            userKey: user.key
        });
    }

    async save() {
        await this.store.save(this);    
    }
}