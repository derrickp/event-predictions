
import { Privilege } from "../Privilege";

/**
 * A representation of a user of the predictions site.
 */
export interface UserDTO {
    key: string;
    email: string;
    display: string;
    avatar: string;
    generalPrivilege: Privilege;
    predictionTemplateIds?: string[];
    pickIds?: string[];
}