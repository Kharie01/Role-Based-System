import {logInUserServices, createUserServices} from "../services/authServices.js"
import {getProfileService, getAllUserService} from "../services/userServices.js"
import { getToken } from "../services/tokenServices.js";
import { generateTokens } from "./tokenRefresh.js";

import catchAsync from "../utils/catchAsync.js";
import { success } from "zod";



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
    const user = await logInUserServices(
        req.body.email,
        req.body.password);

    const {accessToken, refreshToken} = await generateTokens(user._id, user.role)

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

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

export const logoutUser = catchAsync ( async (req, res) => {
    const token = await getToken(req.cookies.refreshToken)
    
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    if(token) {
        res.status(200).json({
            success: "true",
            message: "Logged out successfully"
        })
    }

})