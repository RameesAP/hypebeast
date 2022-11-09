const db = require('../config/connection')
const collection = require('../config/collection')
const { response } = require('../app')
const bcrypt = require('bcrypt')

const { ObjectId } = require('mongodb')


module.exports = {

    addCategory: (category) => {
        return new Promise((resolve, reject) => {
            try {
                db.get().collection('cat').insertOne(category).then((data) => {
                    resolve(data)
                })
            } catch (error) {
                reject(error)
            }
  
        })

    },
    getAllCategory: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let ShowCat = await db.get().collection('cat').find().toArray()
                resolve(ShowCat)
            } catch (error) {
                reject(error) 
            }
  
        })
    },
    categoryDel: (catId) => {
        return new Promise((resolve, reject) => {
            try {
                db.get().collection('cat').deleteOne({ _id: ObjectId(catId) }).then((response) => {
                    resolve(response)
                })
            } catch (error) {
                reject(error)
            }
  
        })

    },

    getCategory: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let cat = await db.get().collection("cat").find().toArray()
                console.log(cat, "ttttttttttttttttttttttttttt");
                resolve(cat)
            } catch (error) {
                reject(error)
            }


        })

    },

    getByCategory:(categoryid)=>{
        let catId=ObjectId(categoryid)
        // console.log(typeof(catId),"hhhhh444", catId);

        return new Promise(async(resolve,reject)=>{
            try {
                let products =await db.get().collection('products').find({category:catId}).toArray()
                // console.log(products?.ops[0]);
                // console.log(products,"products");
            resolve(products)
            } catch (error) {
                reject(error)
            }
        })
    }

}