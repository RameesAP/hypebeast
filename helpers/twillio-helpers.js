const client = require('twilio')('AC948b0081ed24dd01500f90b6a3507282', 'f19c3653bd8650d92bec21cd36b9bddd');
const serviceSid = 'VA3b8f1fba50893c3757f998acebacf216'

module.exports = {

    doSms: (userData) => {

        return new Promise(async (resolve, reject) => {
            let res = {}
            console.log(userData);
            console.log('eeeeeeeeeeeeeeee');
            await client.verify.services(serviceSid).verifications.create({

                to: `+91${userData.phonenumber}`,
                channel: "sms"
            }).then((reeee) => {
                res.valid = true;
                resolve(res)
                console.log(reeee);
            }).catch((err) => {

                console.log(err);

            })
        })
    },

    otpVerify: (otpData, userData) => {
        console.log(otpData);
        console.log(userData);


        return new Promise(async (resolve, reject) => {
            await client.verify.services(serviceSid).verificationChecks.create({
                to: `+91${userData.phonenumber}`,
                code: otpData.otp
            }).then((verifications) => {
                console.log(verifications);
                resolve(verifications.valid)
            })
        })
    }



}