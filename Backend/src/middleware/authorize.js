import AppError from "../utils/appError.js"

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!req.user || !req.user.role){
            return next(new AppError("Unauthorized", 401));
        }

        if(!roles.includes(req.user.role)){
            return next(
                new AppError(
                    "You do not have permission to perform this actions",
                    403
                )
            )
        }
        
        next();
    }
}