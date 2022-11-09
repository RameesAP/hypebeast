const db = require('../config/connection')
const collection = require('../config/collection')
const { response } = require('bcrypt')

const bcrypt = require('bcrypt')

const { ObjectId } = require('mongodb')
const productHelpers = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user-helpers')

module.exports = {

    addCoupon: (coupon) => {
        console.log(coupon, 'coupennnnnnnnnn');
        return new Promise((resolve, reject) => {
            try {
                console.log('hi');
                db.get().collection('coupon').insertOne(coupon).then((data) => {
                    console.log(data);
                    resolve(data)
                })
            } catch (error) {
                reject(error)
            }

        })
    },

    getAllCoupon: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let allCoupons = await db.get().collection('coupon').find().toArray()
                resolve(allCoupons)
            } catch (error) {
                reject(error)
            }
  
        })
    },

    couponDelete: (couponId) => {
        return new Promise(async (resolve, reject) => {
            try {
                db.get().collection('coupon').deleteOne({ _id: ObjectId(couponId) }).then((response) => {
                    resolve(response)
                })
            } catch (error) {
                reject(error)
            }
  
        })
    },

    applyCoupen: (userID, coupenData) => {
        console.log(coupenData.code);
        return new Promise(async (resolve, reject) => {
            try {
                let response = {};
                response.discount = 0
                let coupen = await db.get().collection('coupon').findOne({ coupencode: coupenData.code })
                if (coupen) {
                    response.coupen = coupen
                    let coupenuser = await db.get().collection('coupon').findOne({
                        coupenCode: coupenData.code, userID: { $in: [userID] },
                    })
                    if (coupenuser) {
                        response.status = false
                        resolve(response)
                    } else {
                        response.status = true
                        response.coupen = response
                        userHelpers.getCartProducts(userID).then((cartProd) => {
                            console.log(cartProd, "oooooooo")
                            // cart = cartProd.cart
                            // console.log(cart,"rrrrrrrrrrrrrrrrrrrrr");

                            let grandTotal
                            if (cartProd) {
                                console.log(cartProd.cartItems.Price,"cartProd.price");
                                let cartlength = cartProd.cartItems.length
                                console.log("length", cartlength);
                                if (cartlength >= 0) {
                                    grandTotal = cartProd.cartItems.reduce((acc, curr) => {
                                        acc += curr.Price * curr.quantity
                                        return acc
                                    }, 0)
                                    
                                    let coupenDiscount = parseInt(coupen.discount)
                                    console.log(typeof(coupenDiscount),"lll",coupenDiscount)

                                    response.discount =
                                        (grandTotal * coupenDiscount) / 100
                                        console.log(typeof(response.discount),response.discount,"ooooo")
                                    grandTotal = grandTotal - response.discount;
                                    console.log("discount price", grandTotal);

                                    response.grandTotal = grandTotal
                                    response.coupen = coupen

                                    resolve(response)


                                }else{
                                    resolve(response)
                                }
                            }else{
                                resolve(response)
                            }
                        })
                    }
                }else{
                    response.status=false

                    console.log('afterrrrrrrrrrr',response);
                    resolve(response)
                }
            } catch (error) {
                console.log("errror",error);
               reject(error)
            }
        })
    }





}