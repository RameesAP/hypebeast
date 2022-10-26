const db = require('../config/connection')
const collection = require('../config/collection')
const { response } = require('../app')
const bcrypt = require('bcrypt')

const { ObjectId } = require('mongodb')
const  objectId=require('mongodb').ObjectId



module.exports = {


    insertProducts:(productDetails)=>{
        console.log(productDetails,'productDetails');
        productDetails.price = parseInt(productDetails.price)
        return new Promise((resolve,reject)=>{
            db.get().collection('products').insertOne(productDetails).then((data)=>{
                console.log(data,'data')
                resolve(data)
            })
        })
    },

    viewProducts:()=>{

        return new Promise(async(resolve,reject)=>{
        let viewproduct=await db.get().collection('products').find().toArray()
        console.log(viewproduct)
        resolve(viewproduct)

        })
    },

    getAllProduct:()=>{
        return new Promise(async (resolve, reject) => {
            let products=await db.get().collection('products').find().toArray()
            resolve(products)
        })
    },

     deleteProduct:(prodId)=>{
      console.log(prodId,'proooooooooooo');
        return new Promise((resolve,reject)=>{
            console.log(prodId);
            console.log(objectId(prodId));
            db.get().collection('products').deleteOne({_id:objectId(prodId)}).then((response)=>{
               console.log(response)
                resolve(response)
            })
        })
    },
    editproduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('products').findOne({_id:objectId(prodId)}).then((products)=>{
            console.log(products,'produts');
                resolve(products)
            })
        })
    },

    
    updateProduct: (proId, productDetails) => {
      console.log(productDetails,'details');
    return new Promise((resolve, reject) => {
      try {

        db.get().collection('products')
          .updateOne({ _id: objectId(proId) }, {
            $set: {

              name: productDetails.name,
              description: productDetails.description,
              price: productDetails.price,
              image: productDetails.image
              

            }
          }).then((response) => {
            resolve()
          })


      } catch (error) {
        reject(error)
      }
    })

  },


  getSingleProduct : (id)=>{
    return new Promise((resolve,reject)=>{
     
    db.get().collection('products').findOne({ _id: objectId(id) }).then((response) => {
      console.log(response)
      resolve(response)
    })
    })
  },






  ///////banner


  bannerAdd:(bannerDetails)=>{
    console.log(bannerDetails,'bannerDetails');
    return new Promise((resolve,reject)=>{
      db.get().collection('banners').insertOne(bannerDetails).then((data)=>{
        console.log(data,'data');
        resolve(data)
      })

    })
  },

  viewBanners:()=>{

    return new Promise(async(resolve,reject)=>{
      let viewbanners=await db.get().collection('banners').find().toArray()
      console.log(viewbanners,"kkkkk");
      resolve(viewbanners)
    })
  },

  getAllBanners:()=>{
    return new Promise(async(resolve,reject)=>{
      let banners=db.get().collection('banners').find().toArray()
      resolve(banners)
    })
  },

  deleteBanner:(bannerId)=>{
    return new Promise((resolve,reject)=>{
      console.log(bannerId);
      console.log(objectId(bannerId));
      db.get().collection('banners').deleteOne({_id:objectId(bannerId)}).then((response)=>{
        console.log(response);
        resolve(response)
      })
    })
  },

  editBanner:(bannerId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection('banners').findOne({_id:objectId(bannerId)}).then((banners)=>{
        console.log(banners,'banners');
        resolve(banners)
      })
    })
  },

  updateBanner:(bannerId,bannerDetails)=>{
    console.log(bannerDetails,"detailsssss");
    return new Promise((resolve,reject)=>{
      try{
        db.get().collection('banners')
        .updateOne({_id:objectId(bannerId)},{
          $set:{
            name:bannerDetails.name,
            description:bannerDetails.description,
            image:bannerDetails.image

          }
        }).then((response)=>{
          resolve()
        })
      }catch (error){
        reject(error)

      }
    })
  },




}