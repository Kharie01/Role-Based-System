import RefreshToken from "../model/refreshTokenModel.js";

export const getToken = async (refreshToken) => {
    if (!refreshToken) return false;

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) return false;

    await RefreshToken.deleteOne({token: refreshToken});

    return true;
}

