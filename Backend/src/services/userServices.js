import User from "../model/userModel.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";

export const getProfileService = async (userId) => {

    if(!userId){
        throw new AppError("Unauthorized", 401)
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
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