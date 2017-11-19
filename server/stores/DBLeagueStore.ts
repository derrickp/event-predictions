
import { League } from "../../common/League";
import { LeagueStore } from "../../common/stores/LeagueStore";

import * as mongodb from "mongodb";

export class DBLeagueStore implements LeagueStore {
    private readonly _db: mongodb.Db;
    private readonly _collKey = "leagues";

    constructor(db: mongodb.Db) {
        this._db = db;
    }

    async create(league: League): Promise<string> {
        let key: string = league.display.toLowerCase().split(" ").join("-");
        return key;
    }

    async get(key: string): Promise<League | null> {
        const coll: mongodb.Collection<League> = this._db.collection(this._collKey);
        const league = await coll.findOne({ key });
        return league;
    }

    async getMany(keys?: string[]): Promise<League[]> {
        const coll: mongodb.Collection<League> = this._db.collection(this._collKey);
        const leagues: League[] = [];
        const filter = keys ? { key: {$in: keys }} : undefined;
        const cursor = await coll.find(filter);
        while ((await cursor.hasNext())) {
            const league = await cursor.next();
            if (!keys) {
                leagues.push(league);
            } else if (keys.indexOf(league.key) >= 0) {
                leagues.push(league);
            }
        }
        return leagues;
    }

    async save(league: League): Promise<void> {
        const coll: mongodb.Collection<League> = this._db.collection(this._collKey);
        if (!league.key) {
            throw new Error("invalid-league-key");
        }
        const hasOne = (await coll.count({ key: league.key })) > 0;
        if (hasOne) {
            await coll.updateOne({ key: league.key }, league);
        } else {
            await coll.insertOne(league);
        }
    }

    async saveMany(leagues: League[]): Promise<void> {
        const coll: mongodb.Collection<League> = this._db.collection(this._collKey);
        const promises: Promise<any>[] = [];
        for (const league of leagues) {
            const hasOne = (await coll.count({ key: league.key })) > 0;
            if (hasOne) {
                promises.push(coll.updateOne({ key: league.key }, league));
            } else {
                promises.push(coll.insertOne(league));
            }
        }
        await promises;
    }
}