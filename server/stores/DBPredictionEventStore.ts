
import { PredictionEventDTO } from "../../common/dtos/PredictionEventDTO";

import * as mongodb from "mongodb";

export class DBPredictionEventStore {
    private readonly _db: mongodb.Db;
    private readonly _collKey = "prediction_events";

    constructor(db: mongodb.Db) {
        this._db = db;
    }

    async get(key: string): Promise<PredictionEventDTO> {
        const coll: mongodb.Collection<PredictionEventDTO> = this._db.collection(this._collKey);
        const predictionEvent = await coll.findOne({ key });
        return predictionEvent;
    }

    async getMany(keys: string[]): Promise<PredictionEventDTO[]> {
        const coll: mongodb.Collection<PredictionEventDTO> = this._db.collection(this._collKey);
        const predictionEvents: PredictionEventDTO[] = [];
        const filter = (keys && keys.length > 0) ? { key: {$in: keys }} : undefined;
        const cursor = await coll.find(filter);
        while ((await cursor.hasNext())) {
            const predictionEvent = await cursor.next();
            predictionEvents.push(predictionEvent);
        }
        return predictionEvents;
    }

    async save(predictionEvent: PredictionEventDTO): Promise<void> {
        const coll: mongodb.Collection<PredictionEventDTO> = this._db.collection(this._collKey);
        if (!predictionEvent.key) {
            throw new Error("invalid-league-key");
        }
        const hasOne = (await coll.count({ key: predictionEvent.key })) > 0;
        if (hasOne) {
            await coll.updateOne({ key: predictionEvent.key }, predictionEvent);
        } else {
            await coll.insertOne(predictionEvent);
        }
    }

    async saveMany(predictionEvents: PredictionEventDTO[]): Promise<void> {
        const coll: mongodb.Collection<PredictionEventDTO> = this._db.collection(this._collKey);
        const promises: Promise<any>[] = [];
        for (const predictionEvent of predictionEvents) {
            const hasOne = (await coll.count({ key: predictionEvent.key })) > 0;
            if (hasOne) {
                promises.push(coll.updateOne({ key: predictionEvent.key }, predictionEvent));
            } else {
                promises.push(coll.insertOne(predictionEvent));
            }
        }
        await promises;
    }
}
