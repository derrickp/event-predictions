
import { AuthTypes } from "../../common/AuthRequest";
import { User } from "./User";
import { User as UserDTO } from "../../common/User";

const userMap: Map<string, User> = new Map();

export function get(dto: UserDTO, authType: AuthTypes): User {
    if (userMap.has(dto.key)) {
        return userMap.get(dto.key) as User;
    }

    const user = new User(dto, authType);
    userMap.set(dto.key, user);
    return user;
}