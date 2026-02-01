import refreshTokenModel from "../model/refreshTokenModel.js"
import { signAccessToken,
        signRefreshToken
        } from "../utils/tokens.js";

export const generateTokens = async (userId, role) => {
    const Accesspayload = {userId, role}
    const Refreshpayload = {userId}

    const accessToken = signAccessToken(Accesspayload);
    const refreshToken = signRefreshToken(Refreshpayload);

    await refreshTokenModel.create({
        user: userId,
        token: refreshToken,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return { accessToken, refreshToken}
}