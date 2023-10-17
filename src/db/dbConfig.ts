const sqlite3 = require("sqlite3").verbose();
const filePath = "./src/db/participants.db";

let db: any = null;

const createDbConnection = () => {
    db = new sqlite3.Database(filePath, (error: any) => {
        if (error) {
            return console.error(error.message);
        }
    });
    console.log("Connection with SQLite has been estabilished");
    createTableParticipants();
    return db;
};

const createTableParticipants = () => {
    db.exec(`CREATE TABLE IF NOT EXISTS participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idUser INTEGER,
        idEvent INTEGER
    )`);
};

export { createDbConnection, db };
