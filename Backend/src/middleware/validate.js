import AppError from "../utils/appError.js";
import { ZodError } from "zod";

export const validate = (schema) => async ( req, res, next) => {
    try {
        if(schema.parseAsync){
            await schema.parseAsync(req.body);
        }else{
            schema.parse(req.body);
        }
        
        next();
    } catch (error) {
        if(error instanceof ZodError){

            const message = error.issues.map((err) => `${err.path.join(".")}: ${err.message}`)
            .join("; ");

            return next(new AppError(message, 400))
        }

        return next(error);
    }
}