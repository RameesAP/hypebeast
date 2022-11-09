const db = require('../config/connection')
const collection = require('../config/collection')
const { response } = require('../app')
const bcrypt = require('bcrypt')

const { ObjectId } = require('mongodb')
const objectId = require('mongodb').ObjectId



module.exports = {


  insertProducts: (productDetails) => {
    console.log(productDetails.category ,'productDetails' ,typeof(productDetails.category));
    productDetails.category =objectId(productDetails.category)
    productDetails.price = parseInt(productDetails.price)
    return new Promise((resolve, reject) => {
      try {
        db.get().collection('products').insertOne(productDetails).then((data) => {
          console.log(data, 'data')
          resolve(data)
        })
      } catch (error) {
        reject(error)
      }
     
    })
  },

  viewProducts: () => {

    return new Promise(async (resolve, reject) => {
      try {
        let viewproduct = await db.get().collection('products').find().toArray()
        console.log(viewproduct)
        resolve(viewproduct)
      } catch (error) {
        reject(error)
      }


    })
  },

  getAllProduct: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let products = await db.get().collection('products').find().toArray()
        resolve(products)
      } catch (error) {
        reject(error)
      }

    })
  },

  deleteProduct: (prodId) => {
    console.log(prodId, 'proooooooooooo');
    return new Promise((resolve, reject) => {
      try {
        console.log(prodId);
        console.log(objectId(prodId));
        db.get().collection('products').deleteOne({ _id: objectId(prodId) }).then((response) => {
          console.log(response)
          resolve(response)
        })
      } catch (error) {
        reject(error)
      }
  
    })
  },
  editproduct: (prodId) => {
    return new Promise((resolve, reject) => {
      try {
        db.get().collection('products').findOne({ _id: objectId(prodId) }).then((products) => {
          console.log(products, 'produts');
          resolve(products)
        })
      } catch (error) {
        reject(error)
      }
  
    })
  },


  updateProduct: (proId, productDetails) => {
    console.log(productDetails, 'details');
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


  getSingleProduct: (id) => {
    return new Promise((resolve, reject) => {
      try {
        db.get().collection('products').findOne({ _id: objectId(id) }).then((response) => {
          console.log(response)
          resolve(response)
        })
      } catch (error) {
        reject(error)
      }

    })
  },






  ///////banner


  bannerAdd: (bannerDetails) => {
    console.log(bannerDetails, 'bannerDetails');
    return new Promise((resolve, reject) => {
      try {
        db.get().collection('banners').insertOne(bannerDetails).then((data) => {
          console.log(data, 'data');
          resolve(data)
        })
      } catch (error) {
        reject(error)
      }


    })
  },

  viewBanners: () => {

    return new Promise(async (resolve, reject) => {
      try {
        let viewbanners = await db.get().collection('banners').find().toArray()
        console.log(viewbanners, "kkkkk");
        resolve(viewbanners)
      } catch (error) {
        reject(error)
      }

    })
  },

  getAllBanners: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let banners = db.get().collection('banners').find().toArray()
        resolve(banners)
      } catch (error) {
        reject(error)
      }
  
    })
  },

  deleteBanner: (bannerId) => {
    return new Promise((resolve, reject) => {
      try {
        console.log(bannerId);
        console.log(objectId(bannerId));
        db.get().collection('banners').deleteOne({ _id: objectId(bannerId) }).then((response) => {
          console.log(response);
          resolve(response)
        })
      } catch (error) {
        reject(error)
      }

    })
  },

  editBanner: (bannerId) => {
    return new Promise((resolve, reject) => {
      try {
        db.get().collection('banners').findOne({ _id: objectId(bannerId) }).then((banners) => {
          console.log(banners, 'banners');
          resolve(banners)
        })
      } catch (error) {
        reject(error)
      }

    })
  },

  updateBanner: (bannerId, bannerDetails) => {
    console.log(bannerDetails, "detailsssss");
    return new Promise((resolve, reject) => {
      try {
        db.get().collection('banners')
          .updateOne({ _id: objectId(bannerId) }, {
            $set: {
              name: bannerDetails.name,
              description: bannerDetails.description,
              image: bannerDetails.image

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