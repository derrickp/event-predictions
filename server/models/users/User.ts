
import { Observable } from "../../../common/Observable";
import { Privilege } from "../../../common/Privilege";
import { UserDTO } from "../../../common/dtos/UserDTO";

export default class User extends Observable implements UserDTO {
    key: string;
    email: string;
    display: string;
    avatar: string;
    generalPrivilege: Privilege;
    predictionTemplateIds?: string[];
    pickIds?: string[];

    get dto(): UserDTO {
        return {
            key: this.key,
            email: this.email,
            display: this.display,
            generalPrivilege: this.generalPrivilege,
            pickIds: this.pickIds,
            predictionTemplateIds: this.predictionTemplateIds,
            avatar: this.avatar
        };
    }

    constructor(dto: UserDTO) {
        super();
        this.key = dto.key;
        this.email = dto.email;
        this.display = dto.display;
        this.generalPrivilege = dto.generalPrivilege;
        this.predictionTemplateIds = dto.predictionTemplateIds ? dto.predictionTemplateIds : [];
        this.pickIds = dto.pickIds ? dto.predictionTemplateIds : [];
    }
}