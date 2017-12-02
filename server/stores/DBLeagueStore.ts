
import { LeagueDTO } from "../../common/dtos/LeagueDTO";
import { LeagueStore } from "../../common/stores/LeagueStore";

import * as mongodb from "mongodb";

export class DBLeagueStore implements LeagueStore {
    private readonly _db: mongodb.Db;
    private readonly _collKey = "leagues";

    constructor(db: mongodb.Db) {
        this._db = db;
    }

    async create(league: LeagueDTO): Promise<string> {
        let key: string = league.display.toLowerCase().split(" ").join("-");
        return key;
    }

    async get(key: string): Promise<LeagueDTO | null> {
        const coll: mongodb.Collection<LeagueDTO> = this._db.collection(this._collKey);
        const league = await coll.findOne({ key });
        return league;
    }

    async getMany(keys: string[]): Promise<LeagueDTO[]> {
        const coll: mongodb.Collection<LeagueDTO> = this._db.collection(this._collKey);
        const leagues: LeagueDTO[] = [];
        const filter = (keys && keys.length > 0) ? { key: {$in: keys }} : undefined;
        const cursor = await coll.find(filter);
        while ((await cursor.hasNext())) {
            const league = await cursor.next();
            leagues.push(league);
        }
        return leagues;
    }

    async save(league: LeagueDTO): Promise<void> {
        const coll: mongodb.Collection<LeagueDTO> = this._db.collection(this._collKey);
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

    async saveMany(leagues: LeagueDTO[]): Promise<void> {
        const coll: mongodb.Collection<LeagueDTO> = this._db.collection(this._collKey);
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