
import { Privileges } from "../../common/Privileges";
import { UserDTO } from "../../common/dtos/UserDTO";
import { UserStore } from "../../common/stores/UserStore";

export default class User implements UserDTO {
    key: string;
    email: string;
    display: string;
    avatar: string;
    generalPrivilege: Privileges;
    predictionTemplateIds?: string[];
    pickIds?: string[];

    store: UserStore;

    constructor(dto: UserDTO, store: UserStore) {
        this.key = dto.key;
        this.email = dto.email;
        this.display = dto.display;
        this.generalPrivilege = dto.generalPrivilege;
        this.predictionTemplateIds = dto.predictionTemplateIds ? dto.predictionTemplateIds : [];
        this.pickIds = dto.pickIds ? dto.predictionTemplateIds : [];
    }

    async save() {
        this.store.save(this);
    }
}