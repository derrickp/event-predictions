
import { User } from "../../common/User";
import { UserStore } from "../../common/stores/UserStore";

import * as mongodb from "mongodb";

export class DBUserStore implements UserStore {

    private readonly _db: mongodb.Db;
    private readonly _collKey = "users";

    constructor(db: mongodb.Db) {
        this._db = db;
    }

    async create(user: User): Promise<string> {
        return "";
    }

    async get(key: string): Promise<User | null> {
        const coll: mongodb.Collection<User> = this._db.collection(this._collKey);
        const user = await coll.findOne({ key });
        return user;
    }

    async getByEmail(email: string): Promise<User | null> {
        const coll: mongodb.Collection<User> = this._db.collection(this._collKey);
        const user = await coll.findOne({ email });
        return user;
    }

    async getMany(keys: string[]): Promise<User[]> {
        return [];
    }

    async save(user: User): Promise<void> {
        const coll: mongodb.Collection<User> = this._db.collection(this._collKey);
        if (!user.key) {
            throw new Error("invalid-league-key");
        }
        const hasOne = (await coll.count({ key: user.key })) > 0;
        if (hasOne) {
            await coll.updateOne({ key: user.key }, user);
        } else {
            await coll.insertOne(user);
        }
    }

    async saveMany(users: User[]): Promise<void> {

    }
}