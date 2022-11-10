const db = require('../config/connection')
const collection = require('../config/collection')
const { response } = require('../app')
const bcrypt = require('bcrypt')

const { ObjectId } = require('mongodb')
const objectId = require('mongodb').ObjectId



module.exports = {


  insertProducts: (productDetails) => {
    console.log(productDetails.category, 'productDetails', typeof (productDetails.category));
    productDetails.category = objectId(productDetails.category)
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

  shipProduct: (orderid) => {

    const id = objectId(orderid)
    console.log(orderid, 'idddddddddddddd');
    console.log(typeof (id))
    return new Promise(async (resolve, reject) => {
      try {
        await db.get().collection('orders').updateOne({ _id: objectId(id) },
          {
            $set: {

              deliveryStatus: "Shipped"
            }
          }

        ).then((response) => {
          resolve(response)
        })
      } catch (error) {
        reject(error)
      }
    })
  },

  deliverProduct: (orderid) => {

    const id = objectId(orderid)
    console.log(orderid, 'idddddddddddddd');
    console.log(typeof (id))
    return new Promise(async (resolve, reject) => {
      try {
        await db.get().collection('orders').updateOne({ _id: objectId(id) },

          {
            $set: {
              deliveryStatus: 'Deliverd'
            }
          }
        ).then((response) => {
          resolve(response)
        })
      } catch (error) {
        reject(error)
      }
    })
  },

  cancelOrder: (orderid) => {

    const id = objectId(orderid)
    console.log(orderid, 'idddddddddddddd');
    console.log(typeof (id))
    return new Promise(async (resolve, reject) => {
      try {
        await db.get().collection('orders').updateOne({ _id: objectId(id) },
          {

            $set: {
              deliveryStatus: 'Cancelled'
            }
          }


        ).then((response) => {
          resolve(response)
        })

      } catch (error) {
        reject(error)
      }
    })
  },




  getProductDetails:(productId)=>{
    console.log(productId,'id');
    console.log(typeof(productId))
    const id=objectId(productId)
    return new Promise((async(resolve,reject)=>{
      try {
        let singleproduct = await db.get().collection('orders').aggregate(

          [

            { $match: { _id: objectId(id) } },
            {
              '$project': {
                'userid': 1, 
                'paymentDetails': 1, 
                'deliveryAddress': 1, 
                'status': 1, 
                'data': 1, 
                'grandTotal': 1, 
                'discountAmount': 1, 
                'deliveryStatus': 1, 
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
              }
            }, {
              '$lookup': {
                'from': 'address', 
                'localField': 'deliveryAddress', 
                'foreignField': '_id', 
                'as': 'addressdetails'
              }
            }, {
              '$unwind': {
                'path': '$addressdetails'
              }
            }, {
              '$project': {
                'userid': 1, 
                'paymentDetails': 1, 
                'status': 1, 
                'deliveryStatus': 1, 
                'grandTotal': 1, 
                'discountAmount': 1, 
                'productQty': 1, 
                'addressId': '$addressdetails._id', 
                'address1': '$addressdetails.addressDetails.address1', 
                'address2': '$addressdetails.addressDetails.address2', 
                'city': '$addressdetails.addressDetails.city', 
                'state': '$addressdetails.addressDetails.state', 
                'pincode': '$addressdetails.addressDetails.state', 
                'productname': '$productDetails.name', 
                'productsize': '$productDetails.size', 
                'productprice': '$productDetails.price', 
                'discription': '$productDetails.description', 
                'image': '$productDetails.image', 
                'productcategory': '$productDetails.category'
              }
            }, {
              '$lookup': {
                'from': 'cat', 
                'localField': 'productcategory', 
                'foreignField': '_id', 
                'as': 'cat'
              }
            }, {
              '$project': {
                'userid': 1, 
                'paymentDetails': 1, 
                'status': 1, 
                'deliveryStatus': 1, 
                'addressId': 1, 
                'address1': 1, 
                'address2': 1, 
                'city': 1, 
                'state': 1, 
                'productQty': 1, 
                'pincode': 1, 
                'productname': 1, 
                'grandTotal': 1, 
                'discountAmount': 1, 
                'productsize': 1, 
                'productprice': 1, 
                'discription': 1, 
                'image': 1, 
                'productcategory': '$cat.category'
              }
            }
          ]
        ).toArray()
        console.log(singleproduct,"singleproduct");
        resolve(singleproduct)
      } catch (error) {
        
      }
    }))

  }



}