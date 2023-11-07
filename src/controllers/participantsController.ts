import { Request, Response } from "express";
import axios from "axios";
import Participant from "../models/Participant";
import { initializeDatabase } from "../db/dbConfig";

const dbPromise = initializeDatabase();

export const participantsController = {
    addParticipant: async (req: Request, res: Response) => {
        const participant: Participant = req.body;

        const user = await utils.getUser(participant.idUser);
        const event = await utils.getEvent(participant.idEvent);

        if (!user || !event) {
            return res.send("participant not added");
        }

        if (!(await utils.validateAvailableSeats(participant.idEvent))) {
            return res.send("no seats available");
        }

        if (await utils.isParticipantInEvent(participant)) {
            return res.send("participant already registered");
        }

        const sql = `INSERT INTO participants(idUser, idEvent) VALUES (:idUser, :idEvent);`;

        const db = await dbPromise;

        await db.run(sql, {
            ":idUser": participant.idUser,
            ":idEvent": participant.idEvent,
        });

        return res.status(201).send("participant added");
    },
};

export const utils = {
    getUser: async (userId: string) => {
        try {
            const response = await axios.get(
                `${process.env.API_GATEWAY}/users/${userId}`
            );
            return response;
        } catch (error) {
            return undefined;
        }
    },

    getEvent: async (eventId: string) => {
        try {
            const response = await axios.get(
                `${process.env.API_GATEWAY}/events/${eventId}`
            );
            return response.data;
        } catch (error) {
            return undefined;
        }
    },
    isParticipantInEvent: async (participant: Participant) => {
        try {
            const sql = `
            SELECT * FROM participants WHERE idEvent= :idEvent AND idUser= :idUser
            `;

            const db = await dbPromise;

            const result = await db.get(sql, {
                ":idEvent": participant.idEvent,
                ":idUser": participant.idUser,
            });

            return result ? true : false;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    },

    validateAvailableSeats: async (eventId: string) => {
        try {
            const event = await utils.getEvent(eventId);
            const seats = event.vagas;

            const db = await dbPromise;

            const sql = `SELECT COUNT(*) as registered FROM participants WHERE idEvent = ?`;
            const result = await db.get(sql, [eventId]);

            return result.registered < seats;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    },
};
