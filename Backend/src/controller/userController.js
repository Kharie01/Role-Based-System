import {logInUserServices, createUserServices} from "../services/authServices.js"
import {getProfileService, getAllUserService} from "../services/userServices.js"
import jwt from "jsonwebtoken";

import catchAsync from "../utils/catchAsync.js";


export const createUser = catchAsync (async (req,res) => {
    let { name,
            email,
            age,
            password } = req.body;

    await createUserServices(name,email,age,password);

    res.status(201).json({
        message: "User registered successfully"
    })
});

export const validateUser = catchAsync(async (req,res) => {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const user = await logInUserServices(email,password);
    
    const token = jwt.sign({id: user._id, role: user.role}, 
        process.env.JWT_SECRET_KEY,
        {expiresIn: "1d"});

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
})

export const getProfile = catchAsync ( async (req, res) => {
    const user = await getProfileService(req.user.id);
    res.json(user);
})

export const getAllUser = catchAsync ( async (req, res) => {
    const users = await getAllUserService(req.user.role)

    res.status(200).json({
        success: "true",
        count: users.length,
        users,
    })
})