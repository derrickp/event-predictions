
import { AuthTypes } from "../../common/AuthRequest";
import { LeagueDTO } from "../../common/dtos/LeagueDTO";
import { UserDTO } from "../../common/dtos/UserDTO";
import { LeaguePrivilege } from "../../common/LeaguePrivilege";

export class User {
    avatar: string;
    display: string;
    email: string;
    key: string;
    authType: AuthTypes;
    privileges: LeaguePrivilege[];
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

    canAccessLeague(league: LeagueDTO): boolean {
        const privilege = this.privileges.find(p => p.leagueId === league.key);
        return !!privilege;
    }
}