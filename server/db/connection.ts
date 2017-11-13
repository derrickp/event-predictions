import * as mongodb from "mongodb";

let db: mongodb.Db;

export function setDb(new_db: mongodb.Db) {
    db = new_db;
}

export function getDb() {
    return db;
}