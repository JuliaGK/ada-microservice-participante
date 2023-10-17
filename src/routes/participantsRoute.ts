import { Router } from "express";
import addParticipant from "../controllers/participantsController";

const participantsRouter = Router();

participantsRouter.post("/addParticipants", addParticipant);

export default participantsRouter;
