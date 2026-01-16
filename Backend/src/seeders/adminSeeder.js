import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../model/userModel.js";
import dotenv from "dotenv";

dotenv.config()

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION);

        const adminEmail = process.env.ADMIN_EMAIL;

        const existingAdmin = await User.findOne({email: adminEmail});

        if(existingAdmin){
            console.log("Admin already exists");
            process.exit(0);
        }

        await User.create({
            name: "System Admin",
            age: "21",
            email: adminEmail,
            password: process.env.ADMIN_PASSWORD,
            role: "admin",
        })

        console.log("Admin account created successfully");
        process.exit(0);

    } catch (error) {
        console.error("Admin seeding failed:", error);
        process.exit(1);
    }
}

seedAdmin();