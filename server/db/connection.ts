import * as mongodb from "mongodb";

let db: mongodb.Db;

export function setDb(newDb: mongodb.Db) {
    db = newDb;
}

export function getDb() {
    return db;
}
