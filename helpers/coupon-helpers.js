const db = require('../config/connection')
const collection = require('../config/collection')
const { response } = require('bcrypt')

const bcrypt = require('bcrypt')

const { ObjectId } = require('mongodb')

module.exports = {

    addCoupon: (coupon) => {
        console.log(coupon, 'coupennnnnnnnnn');
        return new Promise( (resolve, reject) => {
            console.log('hi');
             db.get().collection('coupon').insertOne(coupon).then((data) => {
                console.log(data);
                resolve(data)
            })
        })
    },

    getAllCoupon:()=>{
        return new Promise(async(resolve,reject)=>{
          let allCoupons = await db.get().collection('coupon').find().toArray()
            resolve(allCoupons)
        })
    },

    couponDelete:(couponId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection('coupon').deleteOne({_id:ObjectId(couponId)}).then((response)=>{
                resolve(response)
            })
        })
    }





}