
const db = require('../config/connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { router, response } = require('../app')
// const { ObjectId } = require('mongodb')
const  objectid=require('mongodb').ObjectId
// var mongoose = require('mongoose');

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

    doSignin:(userData)=>{
        
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.password,10);
            db.get().collection('user').insertOne(userData).then((data)=>{
                resolve(data)
               
            })
        })
    },
    verifyUser:(userData)=>{
        let response={}
        return new Promise(async(resolve, reject)=>{
            let verify = await db.get().collection('user').findOne({email:userData.email})
    
            if(verify){
                response.status= false
                resolve(response)
            }else{
                response.status=true
                resolve(response)
            }
    
        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
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
        })
    },

    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            let user = db.get().collection("user").find().toArray()
            resolve(user)

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
   let itemid =  objectid(productid)
    console.log(productid,'123456',typeof(itemid))
    
    // let product = proId.productid
    // console.log(product,"tttttttt",typeof (product))
    // let productId = mongoose.Types.ObjectId(product)
    // console.log(typeof(productId),"iiiiiiddddddd")
    let proObj = {
               item: itemid,
               quantity: 1,
               
           }
   
           return new Promise(async (resolve, reject) => {
               try{
                   let userCart = await db.get().collection('cart').findOne({ user: objectid(userId) })
                   console.log(userCart,'cart');
               if (userCart) {
                
                   let productExist = await db.get().collection('cart').findOne({ user: objectid(userId) ,products:{$elemMatch:{item:objectid(productid)}}})
                   //userCart.products.findIndex(products => products.item == itemid)
                   console.log(productExist,'===================================');
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
                           updateOne({ user: objectid(userId)},
                               { $push: { products: proObj}}).then((response) => {
                                   resolve()
                               }).catch((response)=>{
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
               }catch(error){
                reject(error)
               }
           })
       },
       verifyUser: (userData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
        try {
          
                let verify = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })

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

    getCartProducts:(usrID)=>{
        // console.log(usrID,typeof(usrID),"aaaaaaa")
        // let id = mongoose.Types.ObjectId(usrID);
        // console.log(typeof(id),"   wwwwwwww");
        return new Promise(async(resolve, reject)=>{
        try {
           
                let cartItems=await db.get().collection('cart').aggregate([
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
                        'productid':'$productDetails._Id',
                        'quantity': 1
                      }
                    },
                    //  {
                    //     '$project':{
                    //         'item':1,'quantity':1,'product':{'$arrayElement':['$products',0]}
                    //     }
                    // }
                  ]).toArray()
                // console.log(cartItems,"ooooooooo");
                resolve(cartItems)
    
          
        } catch (error) {
            reject(error)
        }
    })
    },

    getCartCount:(usrID)=>{
        return new Promise(async(resolve, reject)=>{
        try {
           
                let count=0
                let cart=await db.get().collection('cart').findOne({user:objectid(usrID)})
                if(cart){
                    count=cart.products.length
    
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

    incrementQty:(prodId,userId)=>{
        console.log(prodId,userId,"hooooooooooooooooooooooooi");
        return new Promise(async(resolve,reject)=>{
            try{
            cartModal.updateOne({user:userId,"products.item":prodId},{$inc:{"products.$.quantity":1}}).then(async(response)=>{
                let cart = await cartModal.findOne({user:userId})
                console.log(cart,id);
                let quantity
                for(let i=0;i<products.products.item.length;i++){
                    if(products.products.item[i].products==prodId){
                        quantity=products.products.item[i].quantity
                    }
                }
                response.quantity=quantity
                resolve(response)
            })
            }catch(error){
                reject(error)

            }
        })
    },





    decrimentQty: (prodId,userId)=>{
        console.log(prodId,userId,"haaaaaaaaaaaaaaaaaaai");
        return new Promise(async(resolve,reject)=>{
            try{
                                                   //products.item
               let decValue =await db.get().collection('cart').updateOne({user:objectid(userId),"products.$.item":objectid(prodId)},{$inc:{"products.$.quantity":-1}}).then(async(response)=>{

                // db.get().collection('cart').updateOne({user:objectid(userId),'products':objectid(prodId)},{$inc:{'products.$.quantity':-1}}).then(async(response)=>{
                    
                console.log(response,"oooooooooooooo");
                let cart = await db.get().collection('cart').findOne({user:objectid(userId)})
                console.log(cart,"ggggggggggggggggg");
                console.log(cart.products,"qqq");
                let quantity
                for(let i=0;i<cart.products.length;i++){
                    if(cart.products[i].products==prodId){
                        quantity= cart.products[i].quantity
                    }
                }
                response.quantity=quantity
                resolve(response)
                console.log(response);
               })
            }catch (error){
                reject(error)

            }
        })
    },

    

    deleteCart:(cartId,proId)=>{
        return new Promise((resolve,reject)=>{
        try {
           
                db.get().collection(collection.CART_COLLECTION).updateOne({_id:objectid(cartId)},
                {
                    $pull:{products:{item:objectid(proId)}}
                }
                ).then((response)=>{
                    resolve({removeProduct:true})
                })
           
        } catch (error) {
            reject(error)
        }
    })
    },



    getTotalAmount:(userId)=>{
        return new Promise((resolve,reject)=>{
            try {
              let cart = db.get().collection('cart').findOne({user:objectid(userId)})
              
            } catch (error) {
                
            }
        })
    }
    


}