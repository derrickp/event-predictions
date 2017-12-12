
import { UserDTO } from "../../common/dtos/UserDTO";

import * as mongodb from "mongodb";

export class DBUserStore {

    private readonly _db: mongodb.Db;
    private readonly _collKey = "users";

    constructor(db: mongodb.Db) {
        this._db = db;
    }

    async get(key: string): Promise<UserDTO | null> {
        const coll: mongodb.Collection<UserDTO> = this._db.collection(this._collKey);
        const user = await coll.findOne({ key });
        return user;
    }

    async getByEmail(email: string): Promise<UserDTO | null> {
        const coll: mongodb.Collection<UserDTO> = this._db.collection(this._collKey);
        const user = await coll.findOne({ email });
        return user;
    }

    async getMany(keys: string[]): Promise<UserDTO[]> {
        return [];
    }

    async save(user: UserDTO): Promise<void> {
        const coll: mongodb.Collection<UserDTO> = this._db.collection(this._collKey);
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

    // async saveMany(users: UserDTO[]): Promise<void> {

    // }
}
