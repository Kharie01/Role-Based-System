import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];;
        if(!token){
            return res.status(401).json({message:"Not authenticated"})
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY );

        req.user = {
            id: decoded.userId,
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}