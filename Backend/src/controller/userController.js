import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js"; 

export const createUser = catchAsync (async (req,res) => {
    let { name,
            email,
            age,
            password } = req.body;

    if(!name?.trim() || !email?.trim() || !password?.trim() ){
        throw new AppError("All field are required", 409)
    }

    email = email.trim().toLowerCase();

    const existingEmail = await User.findOne({email})
    if (existingEmail) {
        throw new AppError("Email already exist", 409)
    }

    const newUser = new User({
        name:name, 
        email:email, 
        age:age, 
        password:password, 
        role:"user"
    });
        
    await newUser.save();

    res.status(201).json({
        message: "User registered successfully"
    })
});

export const validateUser = catchAsync(async (req,res) => {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    if (!email?.trim() || !password?.trim()) {
        throw new AppError("Email and password are required", 409)
    }

    const user = await User.findOne({email}).select("+password");

    if(!user) throw new AppError("Invalid Email", 401);

    const isMatch = await user.matchPassword(password.trim());

    if(!isMatch) throw new AppError("Invalid Password", 401)
    
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
    if(!req.user || !req.user.id){
        throw new AppError("Unauthorized", 401)
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
        throw new AppError("Invalid user ID", 400);
    }

    const userId = req.user.id;

    const user = await User.findById(userId).select("-password")

    if(!user){
        throw new AppError("User not found", 404);
    }
    res.json(user);
})

export const getAllUser = catchAsync ( async (req, res) => {
    if(req.user.role !== "admin"){
        throw new AppError("Access denied", 403)
    }

    const users = await User.find({})
    .select("-password -__v")
    .lean();

    res.status(200).json({
        success: "true",
        count: users.length,
        users,
    })
})