const db = require('../config/connection')
const collection = require('../config/collection')
const { response } = require('../app')
const bcrypt = require('bcrypt')

const { ObjectId } = require('mongodb')


module.exports = {

    addCategory: (category) => {
        return new Promise((resolve, reject) => {
            db.get().collection('cat').insertOne(category).then((data) => {
                resolve(data)
            })
        })

    },
    getAllCategory: () => {
        return new Promise(async (resolve, reject) => {
            let ShowCat = await db.get().collection('cat').find().toArray()
            resolve(ShowCat)
        })
    },
    categoryDel: (catId) => {
        return new Promise((resolve, reject) => {
            db.get().collection('cat').deleteOne({ _id: ObjectId(catId) }).then((response) => {
                resolve(response)
            })
        })

    },

    getCategory: () => {
        return new Promise(async (resolve, reject) => {
            let cat =await  db.get().collection("cat").find().toArray()
            console.log(cat,"ttttttttttttttttttttttttttt");
            resolve(cat)

        })

    },
    
}