import { Database } from "sqlite";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const filePath = "./src/db/participants.db";

let db: Database;

const createDbConnection = async () => {
    db = await open({
        filename: filePath,
        driver: sqlite3.Database,
    });
    await createTableParticipants();
    console.log("Connection with SQLite has been estabilished");
};

const createTableParticipants = async () => {
    await db.exec(`CREATE TABLE IF NOT EXISTS participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idUser INTEGER,
        idEvent INTEGER)`);
};

export { createDbConnection, db };
