import express from "express";
import dotenv from "dotenv";
import participantsRouter from "./routes/participantsRoute";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;

const whitelist = ["http://localhost:4000", undefined]; // assuming front-end application is running on localhost port 3000

const corsOptions = {
    origin: function (origin: any, callback: any) {
        console.log(origin);

        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/participants", participantsRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
