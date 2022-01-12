const otpService = require('../services/otp-service')
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const userDto = require('../dtos/user-dto.js');



class AuthController {
    async sendOtp(req, res) {
        const { phone } = req.body;
        if (!phone) {
            res.status(400).json({ message: 'phone no. is required' })
        }

        const otp = await otpService.generateOtp();

        //hash otp
        const ttl = 1000 * 60 * 2;  //2 min
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`
        const hash = hashService.hashOtp(data);


        //send otp
        try {
            // await otpService.sendBySmS(phone, otp)
            return res.json({
                hash: `${hash}.${expires}`,
                phone: phone,
                otp: otp
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'message sending failed' })
        }

        res.json({ hash: hash })
    }

    async verifyOtp(req, res) {
        const { otp, hash, phone } = req.body;
        if (!otp || !hash || !phone) {
            res.status(400).json({ message: "All fields are rquired" })
        }

        const [hashedOtp, expires] = hash.split('.')
        if (Date.now() > +expires) {
            res.status(400).json({ message: 'OTP expired' })
            return;
        }

        const data = `${phone}.${otp}.${expires}`
        const isValid = otpService.verifyOtp(hashedOtp, data);
        if (!isValid) {
            res.status(400).json({ message: 'Invalid OTP' })
        }

        let user;

        try {

            user = await userService.findUser({ phone: phone })
            if (!user) {
                user = await userService.createUser({ phone: phone })
            }
        } catch (error) {
            console.log("error while creating user ");
            res.status(500).json({ message: "DB error" })
        }


        //JWT Token
        const { accessToken, refreshToken } = tokenService.generateTokens({ id: user._id, activated: false })

        await tokenService.storeRefreshToken(refreshToken, user._id)

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        })

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        })

        const userDt = new userDto(user)
        res.json({ userDt, auth: true })

    }

    async refresh(req, res) {
        //get refresh token from coookie
        //check refresh token is valid
        //check if token is in database
        //generate new token 
        //update new refresh token
        //put in cookie
        //response


        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
        } catch (error) {
            res.status(401).json({ message: 'Invalid Token while verifying token' })
        }

        // const ID=userData._id || userData.id 
        var ID;
        try {
            ID = userData.id ? userData.id : userData._id

        } catch (error) {
            res.status(400).json({ message: "cannot fin userData Id inside auth Controller" })
        }

        try {
            const token = await tokenService.findRefreshToken(ID, refreshTokenFromCookie);
            if (!token) {
                return res.status(401).json({ message: "Invalid Token while findeing in DB" })
            }
        } catch (error) {
            return res.status(500).json({ message: "DB Error while refresh Token" })
        }

        const user = await userService.findUser({ _id: ID })
        if (!user) {
            return res.status(404).json({ message: "No user" })
        }


        const { refreshToken, accessToken } = tokenService.generateTokens({ _id: ID })

        try {
            await tokenService.updateRefreshToken(ID, refreshToken)
        } catch (error) {
            return res.status(500).json({ message: "DB Error while refresh Token" })
        }

        try {


            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
            })

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
            })


            const userDt = new userDto(user)
            res.json({ userDt, auth: true })
        } catch (error) {

        }

    }

    async logout(req, res) {
        //deleete refresh token from db
        //delete cookies

        const { refreshToken } = req.cookies;

        await tokenService.removeToken(refreshToken);



        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({ userDt: null, auth: false })
    }
}

module.exports = new AuthController();