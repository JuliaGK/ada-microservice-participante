import { Router } from "express";
import { participantsController } from "../controllers/participantsController";

const participantsRouter = Router();

participantsRouter.post(
    "/addParticipants",
    participantsController.addParticipant
);

export default participantsRouter;
