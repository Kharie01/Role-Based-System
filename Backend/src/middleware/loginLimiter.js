import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => {
        const ip = ipKeyGenerator(req);
        const email = req.body?.email || "unknown";
        return `${ip}:${email}`
    },
    message: {
        message: "Too many login attempts, Try again later.",
    }
})