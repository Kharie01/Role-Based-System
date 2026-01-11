import express, { json } from 'express';
import dotenv from "dotenv";
import connectDB from '../src/config/db.js';

import userRoutes from "../src/router/userRoutes.js"



dotenv.config()

const app = express();
const PORT = 5100 || process.env.PORT;


app.use("/login", userRoutes)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("the server is running in localhost:" + PORT)
    })
})

