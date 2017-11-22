
import { Store } from "../Store"
import { UserDTO } from "../dtos/UserDTO";

export interface UserStore extends Store<UserDTO> {
    create(user: UserDTO): Promise<string>;
    get(key: string): Promise<UserDTO | null>;
    getMany(keys?: string[]): Promise<UserDTO[]>;
    save(user: UserDTO): Promise<void>;
    saveMany(users: UserDTO[]): Promise<void>;
}