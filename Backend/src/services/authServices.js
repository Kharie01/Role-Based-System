import User from "../model/userModel.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";


export const createUserServices = async(name, email,age,password,role) => {

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

    return newUser;
}

export const logInUserServices = async (email,password) => {

    if (!email?.trim() || !password?.trim()) {
        throw new AppError("Email and password are required", 409)
    }

    const user = await User.findOne({email});

    if(!user) throw new AppError("Invalid email or password", 401);

    const isMatch = await user.matchPassword(password.trim());
    
    if(!isMatch) throw new AppError("Invalid email or password", 401)

    return user;
}

export const getProfileService = async (userId) => {

    if(!userId){
        throw new AppError("Unauthorized", 401)
    }

    if (!mongoose.Types.ObjectId.isValid(user)) {
        throw new AppError("Invalid user ID", 400);
    }

    const user = await User.findById(userId).select("-password")

    if(!user){
        throw new AppError("User not found", 404);
    }

    return user;
}

export const getAllUserService = async (role) => {
    if(role !== "admin"){
        throw new AppError("Access denied", 403)
    }

    const users = await User.find({})
    .select("-password -__v")
    .lean();

    return users;
}

