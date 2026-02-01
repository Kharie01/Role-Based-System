import jwt from "jsonwebtoken"

export const signAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_KEY,
        {expiresIn: "15m",}
    );
}

export const signRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_KEY,
        {expiresIn: "7d",}
    );
}