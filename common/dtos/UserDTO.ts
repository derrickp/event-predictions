
import { Privileges } from "../Privileges";

/**
 * A representation of a user of the predictions site.
 */
export interface UserDTO {
    key: string;
    email: string;
    display: string;
    avatar: string;
    generalPrivilege: Privileges;
    predictionTemplateIds?: string[];
    pickIds?: string[];
}