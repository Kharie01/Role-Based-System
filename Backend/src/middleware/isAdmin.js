import AppError from "../utils/appError.js"; 

export const isAdmin = (req, res, next) => {
    if(!req.user){
        throw new AppError("Not authenticated", 401)
    }

    if (req.user.role !== "admin") {
        throw new AppError("Access denied", 403)
    }
    next();
}