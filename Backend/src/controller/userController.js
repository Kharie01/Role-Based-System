import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const createUser = async (req,res) => {
    try {
        let { name,
                email,
                age,
                password } = req.body;

        if(!name?.trim() || !email?.trim() || !password?.trim() ){
            return res.status(409).json({message:"All fields are required"})
        }
        
        email = email.trim().toLowerCase();

        const existingEmail = await User.findOne({email})
        if (existingEmail) {
            return res.status(409).json({message:"Email already exist"})
        }

        const newUser = new User({name:name, email:email, age:age, password:password, role:"user"})
            
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully"
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server erros"})
    }
}

export const validateUser = async (req,res) => {
    try {
        let { email, password } = req.body;
        email = email.trim().toLowerCase();

        if (!email?.trim() || !password?.trim()) {
            return res.status(409).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({email});

        if(!user) return res.status(401).json({
            message:"Invalid email"
        });

        const isMatch = await user.matchPassword(password);
        if(!isMatch) return res.status(401).json({
            message:"Invalid password"
        });
        
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
        

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const getProfile = async (req, res) => {
    try {

        if(!req.user || !req.user.id){
            return res.status(402).json({
                success: false,
                message: "Unauthorized"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const userId = req.user.id;

        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        res.json(user);
    } catch (error) {
        console.error("GET PROFILE ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getAllUser = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}