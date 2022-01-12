const crypto=require('crypto');
const hashService = require('./hash-service');

const smsSid=process.env.SMS_SID;
const smsAuthToken=process.env.SMS_AUTH_TOKEN
const twilio=require('twilio')(smsSid,smsAuthToken,{
    lazyLoading:true
})

class OtpService{
    async generateOtp(){
        const otp= crypto.randomInt(1000,9999);
        return otp;
    }

   async sendBySmS(phone,otp){
        return await twilio.messages.create({
            to:phone,
            from:process.env.SMS_FROM_NUMBER,
            body:`OTP for SpeakItUP is ${otp}. This OTP is valid for only 2 mins `
        })
    }

    verifyOtp(hashedOtp,data){
        let computedHad=hashService.hashOtp(data);

        if(computedHad === hashedOtp){
            return true;
        }
        else{
            return false;
        }
    }
    
}


module.exports=new OtpService();