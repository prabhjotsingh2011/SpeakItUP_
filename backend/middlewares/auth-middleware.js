const tokenService = require("../services/token-service");

module.exports = async function (req, res, next) {

    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            throw new Error('accesToken Not found')
        }

        const userData = await tokenService.verifyAccessToken(accessToken)

        if (!userData){
            throw new Error();
        }
        else {
            req.user = userData;
        } 
            
        next();
    } catch (error) {
        // console.log(error);
        res.status(401).json({ message: 'Invalid Token' })
        return;
    }


}