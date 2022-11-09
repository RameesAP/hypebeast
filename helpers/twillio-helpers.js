const dotenv = require('dotenv')
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const ServiceSID = process.env.TWILIO_Service_SID;
const client = require('twilio')(accountSid,authToken,ServiceSID);


// const client = require('twilio')('AC948b0081ed24dd01500f90b6a3507282', 'eb20a7c1b79b6911dd9fddc27f0d9c88');
// const serviceSid = 'VA3b8f1fba50893c3757f998acebacf216'

module.exports = {

    doSms: (userData) => {

        return new Promise(async (resolve, reject) => {
            try {
                let res = {}
                console.log(userData);
                console.log('eeeeeeeeeeeeeeee');
                await client.verify.services(ServiceSID).verifications.create({

                    to: `+91${userData.phonenumber}`,
                    channel: "sms"
                }).then((reeee) => {
                    res.valid = true;
                    resolve(res)
                    console.log(reeee);
                }).catch((err) => {

                    console.log(err);

                })
            } catch (error) {
                reject(error)
            }

        })
    },

    otpVerify: (otpData, userData) => {
        console.log(otpData);
        console.log(userData);


        return new Promise(async (resolve, reject) => {
            try {
                await client.verify.services(ServiceSID).verificationChecks.create({
                    to: `+91${userData.phonenumber}`,
                    code: otpData.otp
                }).then((verifications) => {
                    console.log(verifications);
                    resolve(verifications.valid)
                })
            } catch (error) {
                reject(error)
            }
          
        })
    }



}