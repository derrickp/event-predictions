
import { AuthTypes } from "../../common/AuthRequest";
import { League } from "../../common/League";
import { User as UserDTO } from "../../common/User";
import { UserLeaguePrivilege } from "../../common/UserLeaguePrivilege";

export class User {
    avatar: string;
    display: string;
    email: string;
    key: string;
    authType: AuthTypes;
    privileges: UserLeaguePrivilege[];
    pickIds: string[];
    predictionTemplateIds: string[];

    constructor(dto: UserDTO, authType: AuthTypes) {
        this.avatar = dto.avatar;
        this.display = dto.display;
        this.email = dto.email;
        this.authType = authType;
        this.pickIds = dto.pickIds ? dto.pickIds : [];
        this.predictionTemplateIds = dto.predictionTemplateIds ? dto.predictionTemplateIds : [];
    }

    canAccessLeague(league: League): boolean {
        const privilege = this.privileges.find(p => p.leagueId === league.key);
        return !!privilege;
    }
}