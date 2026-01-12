import express, { json } from 'express';
import dotenv from "dotenv";
import connectDB from '../src/config/db.js';

import userRoutes from "../src/router/userRoutes.js"

dotenv.config()

const app = express();

app.use(express.json());
const PORT = 5100 || process.env.PORT;

app.use("/api/users", userRoutes)

connectDB().then(() => {
    app.listen(PORT, () => {
       console.log(`Server running on http://localhost:${PORT}`);
    })
})

