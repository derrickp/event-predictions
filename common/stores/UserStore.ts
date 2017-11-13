
import { Store } from "../Store"
import { User } from "../User";

export interface UserStore extends Store<User> {
    create(user: User): Promise<string>;
    get(key: string): Promise<User | null>;
    getMany(keys?: string[]): Promise<User[]>;
    save(user: User): Promise<void>;
    saveMany(users: User[]): Promise<void>;
}