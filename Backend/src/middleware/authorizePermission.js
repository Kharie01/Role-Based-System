import { ROLES } from "../config/roles.js";
import AppError from "../utils/appError.js";

export const requirePermission = (permission) => {
    return(req, res, next) => {
        const role = req.user?.role;

        if(!role){
            return next(new AppError("Unauthorized", 401))
        }

        const permissions = ROLES[role];

        if(!permissions || !permissions.includes(permission)) {
            return next(
                new AppError(
                    "You do not have permission to perform this action",
                    403
                )
            )
        }

        next();
    }
}