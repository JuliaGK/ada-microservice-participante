import { Request, Response } from "express";
import { db } from "../db/dbConfig";
import axios from "axios";

const addParticipant = async (req: Request, res: Response) => {
    type Participant = {
        userId: string;
        eventId: string;
    };
    const participant: Participant = req.body;

    const responseParticipant = await validateParticipant(participant.userId);
    const responseEvent = await validateEvent(participant.eventId);

    if (responseParticipant && responseEvent) {
        const sql = `
            INSERT INTO participants(idUser, idEvent) VALUES (${participant.userId}, ${participant.eventId});
        `;
        db.run(sql, (error: Error) => {
            if (error) {
                res.status(400);
                res.end(error);
            }
            res.status(201);
            res.send("participant added");
        });
    } else {
        res.send("participant not added");
    }
};

async function validateParticipant(userId: string) {
    try {
        await axios.get(`http://localhost:3001/users/${userId}`);
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

async function validateEvent(eventId: string) {
    try {
        await axios.get(`http://localhost:3002/events/${eventId}`);
    } catch (error) {
        return false;
    }
    return true;
}

export default addParticipant;
