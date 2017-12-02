
import { MembershipStore } from "../../common/stores/MembershipStore";
import { Privilege } from "../../common/Privilege";
import { UserLeaguePrivilege } from "../../common/UserLeaguePrivilege";

import * as mongodb from "mongodb";

export class DBMembershipStore implements MembershipStore {
    private readonly _db: mongodb.Db;
    private readonly _collKey = "memberships";

    constructor(db: mongodb.Db) {
        this._db = db;
    }

    async getUserKeys(leagueKey: string): Promise<string[]> {
        const coll = this._db.collection(this._collKey);
        const query = { leagueKey };
        const privilegeCursor = await coll.find<UserLeaguePrivilege[]>(query);
        const keys: string[] = [];
        while ((await privilegeCursor.hasNext())) {
            const privileges = await privilegeCursor.next();
            keys.concat(privileges.map(p => p.userKey));
        }
        return keys;
    }

    async getUserPrivileges(userKey: string): Promise<UserLeaguePrivilege[]> {
        const coll = this._db.collection(this._collKey);
        const query = { userKey };
        const privilegeCursor = await coll.find<UserLeaguePrivilege[]>(query);
        const userLeaguePrivileges: UserLeaguePrivilege[] = [];
        while ((await privilegeCursor.hasNext())) {
            const privileges = await privilegeCursor.next();
            userLeaguePrivileges.concat(privileges.slice());
        }
        return userLeaguePrivileges;
    }

    async getUserPrivilege(userKey: string, leagueKey: string): Promise<Privilege> {
        const coll = this._db.collection(this._collKey);
        const query = { $and: [ { userKey }, { leagueKey } ] };
        const privilege = await coll.findOne<UserLeaguePrivilege>(query);
        if (privilege) {
            return privilege.privilege;
        } else {
            return Privilege.DENIED;
        }
    }

    async changeUserPrivilege(userKey: string, leagueKey: string, privilege: Privilege) {
        const coll = this._db.collection(this._collKey);
        const query = { $and: [ { userKey }, { leagueKey } ] };
        const existing = await coll.findOne<UserLeaguePrivilege>(query);
        console.log(JSON.stringify(existing));

        const newPriv: UserLeaguePrivilege = {
            userKey,
            leagueKey,
            privilege
        };
        if (existing) {
            const result = await coll.findOneAndReplace(query, newPriv);
            if (!result.ok) {
                const errorMessage = JSON.stringify(result.lastErrorObject);
                throw new Error(errorMessage);
            }
        } else {
            const result = await coll.insertOne(newPriv);
            if (result.insertedCount < 1) {
                throw new Error("error-insert-new-membership");
            }
        }
    }
}