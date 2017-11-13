
import { User } from "../../common/User";
import { UserStore } from "../../common/stores/UserStore";

export class DBUserStore implements UserStore {

    async create(user: User): Promise<string> {
        return "";
    }

    async get(key: string): Promise<User | null> {
        return null;
    }

    async getMany(keys: string[]): Promise<User[]> {
        return [];
    }

    async save(user: User): Promise<void> {

    }

    async saveMany(users: User[]): Promise<void> {

    }
}