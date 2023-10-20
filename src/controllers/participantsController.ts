import { Request, Response } from "express";
import { db } from "../db/dbConfig";
import axios from "axios";
import Participant from "../models/Participant";

const addParticipant = async (req: Request, res: Response) => {
    const participant: Participant = req.body;

    const user = await getUser(participant.idUser);
    const event = await getEvent(participant.idEvento);

    if (!user || !event) {
        return res.send("participant not added");
    }

    if (!(await validateAvailableSeats(participant.idEvento))) {
        return res.send("no seats available");
    }

    if (await isParticipantInEvent(participant)) {
        return res.send("participant already registered");
    }

    const sql = `INSERT INTO participants(idUser, idEvent) VALUES (:idUser, :idEvent);`;

    await db.run(sql, {
        ":idUser": participant.idUser,
        ":idEvent": participant.idEvento,
    });

    return res.status(201).send("participant added");
};

async function getUser(userId: string) {
    try {
        const response = await axios.get(
            `${process.env.URL_USER}/users/${userId}`
        );
        return response;
    } catch (error) {
        return undefined;
    }
}

async function getEvent(eventId: string) {
    try {
        const response = await axios.get(
            `${process.env.URL_EVENT}/events/${eventId}`
        );
        return response.data;
    } catch (error) {
        return undefined;
    }
}

async function isParticipantInEvent(participant: Participant) {
    const sql = `
        SELECT * FROM participants WHERE idEvent= :idEvent AND idUser= :idUser
    `;

    const result = await db.get(sql, {
        ":idEvent": participant.idEvento,
        ":idUser": participant.idUser,
    });

    return result ? true : false;
}

async function validateAvailableSeats(eventId: string) {
    try {
        const event = await getEvent(eventId);
        const seats = event.vagas;

        const sql = `SELECT COUNT(*) as registered FROM participants WHERE idEvent = ?`;
        const result = await db.get(sql, [eventId]);

        return result.registered < seats;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export default addParticipant;
