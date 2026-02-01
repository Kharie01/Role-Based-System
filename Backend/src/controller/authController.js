import AppError from "../utils/appError.js";
import RefreshToken from "../model/refreshTokenModel.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken"
import { generateTokens } from "./tokenRefresh.js";

export const refreshAccessToken = catchAsync ( async(req,res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        throw new AppError("No refresh token", 401)
    }

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if(!tokenDoc) {
        throw new AppError("Invalid refresh token", 403);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

    await RefreshToken.deleteOne({ token: refreshToken });

    const {accessToken, refreshToken: newRefreshToken } = 
        await generateTokens(decoded.userId, decoded.role)

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });
})