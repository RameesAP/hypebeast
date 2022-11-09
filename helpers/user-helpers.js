
const db = require('../config/connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { router, response } = require('../app')
const { ObjectId } = require('mongodb')
const e = require('express')
// const { ObjectId } = require('mongodb')
const objectid = require('mongodb').ObjectId
// var mongoose = require('mongoose');

const Razorpay = require('razorpay')
const { resolve } = require('path')

let instance = new Razorpay({
    key_id: 'rzp_test_RYnfWi3oj9XGMF',
    key_secret: 'rVTt9Vw7wTMRF29bHtuOyybD'
})

module.exports = {
    // doSignin: (userData) => {
    //     return new Promise(async (resolve, reject) => {

    //         let user=await db.get().collection("user").findOne({email:userData.email});
    //         const state={
    //             userexist:false,
    //             user:null
    //         }

    //         if(!user){
    //             bcryptpassword = await bcrypt.hash(userData.password, 10)
    //         db.get().collection('user').insertOne({
    //             name: userData.name,
    //             email: userData.email,
    //             phonenumber: userData.phonenumber,
    //             password: bcryptpassword
    //         }).then((data) => {
    //             resolve(state)
    //         })
    //         }else{
    //             state.userexist=true
    //             resolve(state)
    //         }


    //     })


    // },

    doSignin: (userData) => {

        return new Promise(async (resolve, reject) => {
            try {
                userData.Password = await bcrypt.hash(userData.password, 10);
                db.get().collection('user').insertOne(userData).then((data) => {
                    resolve(data)

                })
            } catch (error) {
                reject(error)
            }

        })
    },
    verifyUser: (userData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            try {
                let verify = await db.get().collection('user').findOne({ email: userData.email })

                if (verify) {
                    response.status = false
                    resolve(response)
                } else {
                    response.status = true
                    resolve(response)
                }
            } catch (error) {
                reject(error)
            }


        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                let loginStatus = false
                let response = {}
                console.log("", userData);
                let user = await db.get().collection('user').findOne({ email: userData.email })
                if (user) {
                    if (user.block) {
                        resolve({ status: false })

                    } else {
                        bcrypt.compare(userData.password, user.Password).then((status) => {
                            if (status) {
                                console.log("login success");
                                response.user = user
                                response.status = true
                                resolve(response)
                            } else {
                                console.log("login falied");
                                resolve({ status: false })
                            }
                        })

                    }

                } else {
                    console.log("login failed");
                    resolve({ status: false })
                }
            } catch (error) {
                reject(error)
            }

        })
    },

    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = db.get().collection("user").find().toArray()
                resolve(user)
            } catch (error) {
                reject(error)
            }


        })

    },

    // addToCart:(proId,userId)=>{
    //     return new Promise(async(resolve, reject) => {
    //         let userCart=await db.get().collection('cart').findOne({user:objectId(userId)})
    //         if(userCart){
    //             let cartObj={
    //                 user:objectId(userId),
    //                 product:[objectId(proId)]

    //             }
    //             db.get().collection('cart').insertOne(cartObj).then((response)=>{
    //                 resolve()
    //             })
    //         }
    //     })
    // }

    // gusetUser:(user)=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let user = db.get().collection("user").findOne({email: UserData.email}).toArray()
    //         let userStatus=false
    //         let response={}
    //         if(user){
    //            if(){

    //            }
    //         }else{

    //         }
    //     })
    // }








    addToCart: (proId, userId) => {
        console.log(proId, 'hjgjgjh')
        let productid = proId.productid
        let size = proId.radiosize
        console.log(size, "ppppp");
        let itemid = objectid(productid)
        console.log(productid, '123456', typeof (itemid))

        // let product = proId.productid
        // console.log(product,"tttttttt",typeof (product))
        // let productId = mongoose.Types.ObjectId(product)
        // console.log(typeof(productId),"iiiiiiddddddd")
        let proObj = {
            item: itemid,
            quantity: 1,
            Size: size

        }

        return new Promise(async (resolve, reject) => {
            try {
                let userCart = await db.get().collection('cart').findOne({ user: objectid(userId) })
                console.log(userCart, 'cart');
                if (userCart) {

                    let productExist = await db.get().collection('cart').findOne({ user: objectid(userId), products: { $elemMatch: { item: objectid(productid) } } })
                    //userCart.products.findIndex(products => products.item == itemid)
                    console.log(productExist, '===================================');
                    if (productExist) {
                        console.log('1233333333333333333333333333333333333');
                        db.get().collection('cart')
                            .updateOne({ user: objectid(userId), 'products.item': objectid(itemid) },
                                {
                                    $inc: { 'products.$.quantity': 1 }
                                }
                            ).then(() => {
                                resolve()
                            })
                    } else {
                        console.log('45666666666666666666666666666666666666');

                        db.get().collection('cart').
                            updateOne({ user: objectid(userId) },
                                { $push: { products: proObj } }).then((response) => {
                                    resolve()
                                }).catch((response) => {
                                    console.log(response)
                                })

                    }

                } else {
                    let cartObj = {
                        user: objectid(userId),
                        products: [proObj]
                    }
                    db.get().collection('cart').insertOne(cartObj).then((response) => {
                        resolve()
                    })
                }
            } catch (error) {
                reject(error)
            }
        })
    },
    verifyUser: (userData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            try {

                let verify = await db.get().collection('user').findOne({ email: userData.email })

                if (verify) {
                    response.status = false
                    resolve(response)
                } else {
                    response.status = true
                    resolve(response)
                }



            } catch (error) {
                reject(error)
            }
        })
    },

    // getCartProducts: (usrID) => {
    //     // console.log(usrID,typeof(usrID),"aaaaaaa")
    //     let id = ObjectId(usrID);

    //     console.log(typeof (id), "   wwwwwwww");
    //     return new Promise(async (resolve, reject) => {
    //         try {

    //             let cartItems = await db.get().collection('cart').aggregate([{ $match: { user: objectid(id) } },
    //             {
    //                 '$unwind': {
    //                     'path': '$products'
    //                 }
    //             }, {
    //                 '$project': {
    //                     'user': 1,
    //                     'product': '$products.item',
    //                     'quantity': '$products.quantity',
    //                     'Size': '$products.Size'
    //                 }
    //             }, {
    //                 '$lookup': {
    //                     'from': 'products',
    //                     'localField': 'product',
    //                     'foreignField': '_id',
    //                     'as': 'ProductDetails'
    //                 }
    //             }, {
    //                 '$unwind': {
    //                     'path': '$ProductDetails'
    //                 }
    //             }, {
    //                 '$project': {
    //                     'user': 1,
    //                     'productName': '$ProductDetails.name',
    //                     'Price': '$ProductDetails.price',
    //                     'Category': '$ProductDetails.category',
    //                     'Description': '$ProductDetails.description',
    //                     'image': '$ProductDetails.image',
    //                     'productid': '$ProductDetails._id',
    //                     'quantity': 1,
    //                     'Size': 1

    //                 }
    //             },
    //                 //  {
    //                 //     '$project':{
    //                 //         'item':1,'quantity':1,'product':{'$arrayElement':['$products',0]}
    //                 //     }
    //                 // }
    //             ]).toArray()
    //             console.log(cartItems, "ooooooooo");
    //             resolve(cartItems)


    //         } catch (error) {
    //             reject(error)
    //         }
    //     })
    // },









    getCartProducts: (usrID) => {
        // console.log(usrID,typeof(usrID),"aaaaaaa")
        let id = ObjectId(usrID);

        console.log(typeof (id), "   wwwwwwww");
        return new Promise(async (resolve, reject) => {
            try {

                const response = {};

                let cartItems = await db.get().collection('cart').aggregate([{ $match: { user: objectid(id) } },
                {
                    '$unwind': {
                        'path': '$products'
                    }
                }, {
                    '$project': {
                        'user': 1,
                        'product': '$products.item',
                        'quantity': '$products.quantity',
                        'Size': '$products.Size'
                    }
                }, {
                    '$lookup': {
                        'from': 'products',
                        'localField': 'product',
                        'foreignField': '_id',
                        'as': 'ProductDetails'
                    }
                }, {
                    '$unwind': {
                        'path': '$ProductDetails'
                    }
                }, {
                    '$project': {
                        'user': 1,
                        'productName': '$ProductDetails.name',
                        'Price': '$ProductDetails.price',
                        'Category': '$ProductDetails.category',
                        'Description': '$ProductDetails.description',
                        'image': '$ProductDetails.image',
                        'productid': '$ProductDetails._id',
                        'quantity': 1,
                        'Size': 1

                    }
                },
                    //  {
                    //     '$project':{
                    //         'item':1,'quantity':1,'product':{'$arrayElement':['$products',0]}
                    //     }
                    // }
                ]).toArray()
                if (cartItems) {
                    console.log(cartItems, "ppppppp");
                    if (cartItems.length > 0) {
                        response.cartempty = false
                        response.cartItems = cartItems
                        console.log(response, "lll");
                        resolve(response)
                    } else {
                        response.cartempty = true
                        response.cartItems = cartItems
                        console.log(response, "lll22");
                        resolve(response)
                    }
                } else {
                    response.cartempty = true
                    console.log(response, "lll4444");
                    resolve(response)
                }





            } catch (error) {
                reject(error)
            }
        })
    },










    getCartCount: (usrID) => {
        return new Promise(async (resolve, reject) => {
            try {

                let count = 0
                let cart = await db.get().collection('cart').findOne({ user: objectid(usrID) })
                if (cart) {
                    count = cart.products.length

                }
                resolve(count)

            } catch (error) {
                reject(error)
            }
        })
    },
    getWishlistCount: (usrID) => {
        return new Promise(async (resolve, reject) => {
            try {

                let count = 0
                let wishlist = await db.get().collection('wishlist').findOne({ user: objectid(usrID) })
                if (wishlist) {
                    count = wishlist.products.length

                }
                resolve(count)

            } catch (error) {
                reject(error)
            }
        })
    },

    // changeProductQuantity:(details)=>{
    //     details.count=parseInt(details.count)
    //     details.quantity=parseInt(details.quantity)
    //     return new Promise((resolve,reject)=>{
    //     try {




    //             if(details.count == -1 && details.quantity == 1){
    //                 db.get().collection(collection.CART_COLLECTION)
    //                 .updateOne({_id:objectid(details.cart)},
    //                 {
    //                     $pull:{products:{item:objectid(details.product)}}
    //                 }
    //         ).then((response)=>{

    //             resolve({removeProduct:true})

    //         })
    //             }else{
    //                 db.get().collection('cart').updateOne({_id:objectid(details.cart),'products':objectid(details.product)},{$inc:{'products.$.quantity':details.count}}).then((response)=>{
    //                 resolve({status:true})
    //             })

    //             }




    //     } catch (error) {
    //         reject(error)
    //     }
    // })
    // },


    /////////////////////cart incre and decree/////////////////////////////

    incrementQty: (prodId, userId) => {
        console.log(prodId, userId, "haaaaaaaaaaaaaaaaaaai");
        return new Promise(async (resolve, reject) => {
            try {
                //products.item
                let decValue = await db.get().collection('cart').updateOne({ user: objectid(userId), "products.item": objectid(prodId) }, { $inc: { "products.$.quantity": 1 } }).then(async (response) => {

                    // db.get().collection('cart').updateOne({user:objectid(userId),'products':objectid(prodId)},{$inc:{'products.$.quantity':-1}}).then(async(response)=>{

                    console.log(response, "oooooooooooooo");
                    let cart = await db.get().collection('cart').findOne({ user: objectid(userId) })
                    console.log(cart, "ggggggggggggggggg");
                    console.log(cart, "qqq");
                    let quantity
                    for (let i = 0; i < cart.products.length; i++) {
                        if (cart.products[i].products == prodId) {
                            quantity = cart.products[i].quantity
                        }
                    }
                    response.quantity = quantity
                    resolve(response)
                    console.log(response);
                })
            } catch (error) {
                reject(error)

            }
        })
    },





    decrimentQty: (prodId, userId) => {
        console.log(prodId, userId, "haaaaaaaaaaaaaaaaaaai");
        return new Promise(async (resolve, reject) => {
            try {
                //products.item
                let decValue = await db.get().collection('cart').updateOne({ user: objectid(userId), "products.item": objectid(prodId) }, { $inc: { "products.$.quantity": -1 } }).then(async (response) => {

                    // db.get().collection('cart').updateOne({user:objectid(userId),'products':objectid(prodId)},{$inc:{'products.$.quantity':-1}}).then(async(response)=>{

                    console.log(response, "oooooooooooooo");
                    let cart = await db.get().collection('cart').findOne({ user: objectid(userId) })
                    console.log(cart, "ggggggggggggggggg");
                    console.log(cart.products, "qqq");
                    let quantity
                    for (let i = 0; i < cart.products.length; i++) {
                        if (cart.products[i].products == prodId) {
                            quantity = cart.products[i].quantity
                        }
                    }
                    response.quantity = quantity
                    resolve(response)
                    console.log(response);
                })
            } catch (error) {
                reject(error)

            }
        })
    },



    deleteCart: (userId, prodId) => {
        return new Promise((resolve, reject) => {
            try {

                db.get().collection('cart').updateOne({ user: objectid(userId) },
                    {
                        $pull: { products: { item: objectid(prodId) } }
                    }
                ).then((response) => {
                    resolve(response)
                })

            } catch (error) {
                reject(error)
            }
        })
    },



    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {

                let total = await db.get().collection('cart').aggregate([
                    {
                        '$unwind': {
                            'path': '$products'
                        }
                    }, {
                        '$project': {
                            'user': 1,
                            'product': '$products.item',
                            'quantity': '$products.quantity'
                        }
                    }, {
                        '$lookup': {
                            'from': 'products',
                            'localField': 'product',
                            'foreignField': '_id',
                            'as': 'ProductDetails'
                        }
                    }, {
                        '$unwind': {
                            'path': '$ProductDetails'
                        }
                    }, {
                        '$project': {
                            'user': 1,
                            'productName': '$ProductDetails.name',
                            'Price': '$ProductDetails.price',
                            'Category': '$ProductDetails.category',
                            'Description': '$ProductDetails.description',
                            'image': '$ProductDetails.image',
                            'productid': '$ProductDetails._id',
                            'quantity': 1,

                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: { $multiply: ['$quantity', '$Price'] } }
                        }
                    },
                ]).toArray()
                console.log(total, "ooooooooo");
                console.log('here');
                resolve(total)


            } catch (error) {
                reject(error)
            }
        })

    },











    //////////////////My account user profile///////////////////////
    ////address
    insertAddress: (addressDetails, userId) => {
        return new Promise((resolve, reject) => {
            try {
                db.get().collection('address').insertOne({ addressDetails, user: objectid(userId) }).then((data) => {
                    resolve(data)
                })
            } catch (error) {
                reject(error)
            }

        })

    },
    viewAddress: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let viewAddress = await db.get().collection('address').find({ user: objectid(userId) }).toArray()
                console.log(viewAddress);
                resolve(viewAddress)
            } catch (error) {
                reject(error)
            }

        })
    },





    //////////////Edit profile

    editUser: (userId) => {
        return new Promise((resolve, reject) => {
            try {
                db.get().collection('user').findOne({ _id: objectid(userId) }).then((user) => {
                    console.log(user, 'userrrrrrrrrrr');
                    resolve(user)
                })
            } catch (error) {
                reject(error)
            }

        })

    },








    ///////////////////////edit password









    /////////////////////wishlist/////////////////////////



    addToWishlist: (proId, userId) => {
        console.log(proId, 'Wishhhhhhhhh');
        let productid = proId.productid
        let itemid = objectid(productid)
        console.log(productid, '123456', typeof (itemid));


        let proObj = {
            item: itemid,
        }


        return new Promise(async (resolve, reject) => {
            try {
                let userWishlist = await db.get().collection('wishlist').findOne({ user: objectid(userId) })
                console.log(userWishlist, 'wishlist');
                if (userWishlist) {
                    let productExist = await db.get().collection('wishlist').findOne({ user: objectid(userId), product: { item: objectid(productid) } })
                    console.log(productExist), '=======================';
                    if (productExist) {
                        console.log("11111111111111111111");
                        resolve()
                    } else {
                        console.log("22222222222222222222");
                        db.get().collection('wishlist').updateOne({ user: objectid(userId) },
                            { $push: { products: proObj } }).then((response) => {
                                resolve()
                            }).catch((response) => {
                                console.log(response);
                            })
                    }
                } else {
                    let wishObj = {
                        user: objectid(userId),
                        products: [proObj]
                    }
                    db.get().collection('wishlist').insertOne(wishObj).then((response) => {
                        resolve()
                    })
                }

            } catch (error) {
                reject(error)
            }
        })


    },


    getWishlistProducts: (usrID) => {
        let id = ObjectId(usrID);
        console.log(typeof (id), "   wwwwwwww");
        return new Promise(async (resolve, reject) => {
            try {
                let wishlist = await db.get().collection('wishlist').aggregate([{ $match: { user: objectid(id) } },
                {
                    '$unwind': {
                        'path': '$products'
                    }
                },
                {
                    '$project': {
                        'user': 1,
                        'product': '$products.item',
                        'quantity': '$products.quantity'
                    }

                },
                {
                    '$lookup': {
                        'from': 'products',
                        'localField': 'product',
                        'foreignField': '_id',
                        'as': 'ProductDetails'
                    }
                },
                {
                    '$unwind': {
                        'path': '$ProductDetails'
                    }

                },
                {
                    '$project': {
                        'user': 1,
                        'productName': '$ProductDetails.name',
                        'Price': '$ProductDetails.price',
                        'Category': '$ProductDetails.category',
                        'Description': '$ProductDetails.description',
                        'image': '$ProductDetails.image',
                        'productid': '$ProductDetails._id',
                        'quantity': 1,

                    }
                },
                ]).toArray()
                console.log(wishlist);
                resolve(wishlist)
            } catch (error) {
                reject(error)
            }
        })
    },


    deleteWishlist: (userId, prodId) => {
        return new Promise((resolve, reject) => {
            try {
                db.get().collection('wishlist').updateOne({ user: objectid(userId) },
                    {
                        $pull: { products: { item: objectid(prodId) } }
                    }
                ).then((response) => {
                    resolve(response)
                })

            } catch (error) {
                reject(error)
            }


        })
    },







    //////////////////////////////////order details///////////////////////////////

    // confirmOrder:(userId,paymentDetails,deliveryDetails,productid,grandTotal,discountAmount)=>{
    //     console.log('hi');
    //     console.log(userId,paymentDetails,deliveryDetails,'req.body');
    //     let status = paymentDetails==='cod'?'placed':'pending'
    //     let date=new Date()
    //     console.log(status,"status");
    //     let userid=objectid(userId)
    //     let deliveryAddress=objectid(deliveryDetails)
    //     let productdetails=objectid(productid)
    //     // let totalAmount=objectid(totalPrice)
    //     console.log(typeof(userid))
    //     return new Promise((resolve,reject)=>{
    //         try {
    //             db.get().collection('orders').insertOne({userid,paymentDetails,deliveryAddress,productdetails,status,date,grandTotal,discountAmount}).then((data)=>{

    //                 console.log(data,"dataaaaaaaaaaaaaa");
    //                 resolve(data)
    //                 db.get().collection('cart').deleteOne({user:objectid(userId)})
    //             })
    //         } catch (error) {
    //            console.log(error); 
    //         }
    //     })
    // },



    confirmOrder: async (userId, paymentDetails, deliveryDetails, productid, grandTotal, discountAmount, totalPrice) => {
        console.log('hi');
        console.log(userId, paymentDetails, deliveryDetails, 'req.body');
        let status = paymentDetails === 'cod' ? 'placed' : 'pending'
        let date = new Date()
        console.log(status, "status");
        let userid = objectid(userId)
        let deliveryAddress = objectid(deliveryDetails)
        // let productdetails = objectid(productid)
        // let totalAmount=objectid(totalPrice)
        console.log(typeof (userid))
        let multiproducts = await db.get().collection('cart').findOne({ user: objectid(userid) })
        console.log("hpppppppppppp", multiproducts, "cartttttttttttttttttttttttttttttttt");
        return new Promise((resolve, reject) => {
            try {
                if (grandTotal || discountAmount) {
                    db.get().collection('orders').insertOne({ userid, paymentDetails, deliveryAddress, multiproducts, status, date, grandTotal, discountAmount }).then(async (data) => {

                        if (data) {
                            let order = await db.get().collection('orders').findOne({ _id: data.insertedId })
                            resolve(order)
                        }



                        db.get().collection('cart').deleteOne({ user: objectid(userId) })
                        resolve(response)
                    })
                } else {


                    db.get().collection('orders').insertOne({ userid, paymentDetails, deliveryAddress, multiproducts, status, date, totalPrice }).then(async (response) => {

                        console.log(response, "dataaaaaaaaaaaaaa");
                        if (response) {
                            let order = await db.get().collection('orders').findOne({ _id: response.insertedId })
                            console.log(order, "youuuuuuuuyueuue")
                            resolve(order)

                        }

                        db.get().collection('cart').deleteOne({ user: objectid(userId) })
                    })

                }
            } catch (error) {
                reject(error)
                console.log(error);
            }
        })
    },









    codesuccess: (userId) => {
        console.log(userId, "userid");
        return new Promise(async (resolve, reject) => {
            try {
                let orderDetails = await db.get().collection('orders').aggregate(
                    [
                        { $match: { userid: objectid(userId) } },
                        // {
                        //     '$lookup': {
                        //         'from': 'address',
                        //         'localField': 'deliveryAddress',
                        //         'foreignField': '_id',
                        //         'as': 'result'
                        //     }
                        // }, {
                        //     '$unwind': {
                        //         'path': '$result'
                        //     }
                        // }, {
                        //     '$project': {
                        //         'paymentDetails': 1,
                        //         'userid': 1,
                        //         'address': '$result.addressDetails.address2',
                        //         'city': '$result.addressDetails.city',
                        //         'state': '$result.addressDetails.state',
                        //         'pincode': '$result.addressDetails.pincode',
                        //         'productdetails': 1
                        //     }
                        // }, {
                        //     '$lookup': {
                        //         'from': 'user',
                        //         'localField': 'userid',
                        //         'foreignField': '_id',
                        //         'as': 'result'
                        //     }
                        // }, {
                        //     '$unwind': {
                        //         'path': '$result'
                        //     }
                        // }, {
                        //     '$lookup': {
                        //         'from': 'products',
                        //         'localField': 'productdetails',
                        //         'foreignField': '_id',
                        //         'as': 'productDetails'
                        //     }
                        // }, {
                        //     '$unwind': {
                        //         'path': '$productDetails'
                        //     }
                        // }, {
                        //     '$project': {
                        //         'paymentDetails': 1,
                        //         'address': 1,
                        //         'city': 1,
                        //         'state': 1,
                        //         'pincode': 1,
                        //         'name': '$result.name',
                        //         'email': '$result.email',
                        //         'mobile': '$result.phonenumber',
                        //         'productname': '$productDetails.name',
                        //         'price': '$productDetails.price',
                        //         'image': '$productDetails.image'
                        //     }
                        // }


                        {
                            '$project': {
                                'userid': 1,
                                'paymentDetails': 1,
                                'deliveryAddress': 1,
                                'status': 1,
                                'data': 1,
                                'grandTotal': 1,
                                'discountAmount': 1,
                                'totalPrice': '$totalPrice',
                                'products': '$multiproducts.products.item',
                                'productQty': '$multiproducts.products.quantity',
                                'productsize': '$multiproducts.products.Size'
                            }
                        }, {
                            '$lookup': {
                                'from': 'products',
                                'localField': 'products',
                                'foreignField': '_id',
                                'as': 'productDetails'
                            }
                        }, {
                            '$unwind': {
                                'path': '$productDetails'
                            },
                            
                        }

                    ]
                ).toArray()
                console.log(orderDetails, "hhhhhhhhhhhhhhhhhhhhh");
                resolve(orderDetails)

            } catch (error) {
                reject(error)
            }



        })


    },

    generateRazorpay: (orderId, total) => {
        let grandTotal = parseInt(total)
        return new Promise((resolve, reject) => {
            try {
                var options = {
                    amount: grandTotal * 100,
                    currency: "INR",
                    receipt: "" + orderId

                };
                instance.orders.create(options, function (err, order) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("new ordererrrrrrrrrr:", order);
                        resolve(order)
                    }
                });
            } catch (error) {
                reject(error)
            }


        })
    },
    // verifyPayment:(details)=>{
    //     console.log(details,"detailsssss");
    //     return new Promise(async(resolve,reject)=>{
    //         try {
    //             const crypto =require('crypto')
    //             let hmac=crypto.createHmac('sha256','rVTt9Vw7wTMRF29bHtuOyybD')
    //             let body = details.payment.razorpay_order_id+"|"+details.payment.razorpay_payment_id;
    //             hmac .update(body.toString());
    //             hmac=hmac.digest('hex')
    //             if(hmac==details.payment.razorpay_signature){
    //                 resolve()
    //             }else{
    //                 reject()
    //             }
    //         } catch (error) {

    //         }
    //     })
    // },
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            try {
                const crypto = require('crypto');
                let hmac = crypto.createHmac('sha256', 'rVTt9Vw7wTMRF29bHtuOyybD')

                hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
                hmac = hmac.digest('hex')
                if (hmac == details['payment[razorpay_signature]']) {
                    resolve()
                } else {
                    reject()
                }
            } catch (error) {
                reject(error)
            }

        })
    },

    // changePaymentStatus:(orderId)=>{
    //     console.log(orderId,"hoooooiiii");
    //     return new Promise(async(resolve,reject)=>{
    //         try {
    //             console.log(orderId,"orderIddddddddddddd");
    //             await db.get().collection('order').updateOne({_id:orderId},{OrderStatus:true,status:"success"}).then((response)=>{
    //                 resolve(response)
    //             })
    //         } catch (error) {

    //         }
    //     })
    // },
    changePaymentStatus: (orderId) => {
        console.log(orderId, "hoooooiiii");
        return new Promise(async (resolve, reject) => {
            try {
                console.log(orderId, "orderIddddddddddddd");
                await db.get().collection('orders')
                    .updateOne({ _id: objectid(orderId) },
                        {
                            $set: {
                                status: 'placed'

                            }

                        }
                    ).then(() => {
                        resolve()
                    })
            } catch (error) {
                reject(error)
            }
        })
    },



    deleteAddress: (addressId) => {
        console.log(addressId, "its a addressIDDDDDDDDDDDDDd");
        return new Promise((resolve, reject) => {
            try {
                console.log(addressId);
                console.log(objectid(addressId));
                db.get().collection('address').deleteOne({ _id: objectid(addressId) }).then((response) => {
                    console.log(response);
                    resolve(response)
                })
            } catch (error) {
                reject(error)
            }

        })

    },



    editAddress: (addressId) => {
        return new Promise((resolve, reject) => {
            try {
                db.get().collection('address').findOne({ _id: objectid(addressId) }).then((address) => {
                    console.log(address, "address");
                    resolve(address)
                })
            } catch (error) {
                reject(error)
            }

        })
    },



    updateAddress: (addressId, addressDetails) => {
        console.log(addressDetails, "addressDetails", addressId, "addressId");

        return new Promise((resolve, reject) => {
            try {
                db.get().collection('address')
                    .updateOne({ _id: objectid(addressId) }, {
                        $set: {

                            address1: addressDetails.address1,
                            address2: addressDetails.address2,
                            city: addressDetails, city,
                            state: addressDetails, state,
                            pincode: addressDetails, pincode
                        }
                    }).then((response) => {
                        resolve()
                    })



            } catch (error) {
                reject(error)

            }
        })
    },







}