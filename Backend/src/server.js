import express, { json } from 'express';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from '../src/config/db.js';

import userRoutes from "../src/router/userRoutes.js"

dotenv.config()

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5100",
    credentials: true
}))
const PORT = 5100 || process.env.PORT;

app.use("/api/users", userRoutes)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    })
})

