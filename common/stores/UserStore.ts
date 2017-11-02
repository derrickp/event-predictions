
import { Store } from "../Store"
import { User } from "../User";

export interface UserStore extends Store<User> {
    get(id: string): Promise<User>;
    get(ids?: string[]): Promise<User[]>;
    save(user: User): Promise<void>;
    save(users: User[]): Promise<void>;
}