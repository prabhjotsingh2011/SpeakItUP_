const jwt = require("jsonwebtoken");
const refreshModel = require("../models/refresh-model");


const accessTokenSecret=process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret=process.env.JWT_REFRESH_TOKEN_SECRET;
class tokenService{
     generateTokens(PayLoad){
            const accessToken=jwt.sign(PayLoad,accessTokenSecret,{
                expiresIn:'1m',

            })
            const refreshToken=jwt.sign(PayLoad,refreshTokenSecret,{
                expiresIn:'1y',

            })
            return {accessToken,refreshToken}
    }
    async storeRefreshToken(token,userId){
        try {
            await refreshModel.create({
                token: token,
                userId:userId,
            })
        } catch (error) {
            console.log("this is in storeRefresh token service",error);
        }
    }
    async verifyAccessToken(accessToken){
        return  jwt.verify(accessToken,accessTokenSecret);
    }

    async verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, refreshTokenSecret);
    }

    async findRefreshToken(userId,refreshToken){
        return await refreshModel.findOne({userId:userId, token:refreshToken})
    }

    async updateRefreshToken(userId,refreshToken){
        return await refreshModel.updateOne({userId:userId},{token:refreshToken })  
    }

    async removeToken(refreshToken){
        return await refreshModel.deleteOne({token:refreshToken})
    }
}

module.exports=new tokenService();