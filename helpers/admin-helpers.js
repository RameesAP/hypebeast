const db = require('../config/connection')
const collection = require('../config/collection')
const { response } = require('../app')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')

module.exports = {



    //admin login

    doAdminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = {}
                let admin = await db.get().collection('admin').findOne({ email: adminData.email })
                if (admin) {
                    bcryptPassword = await bcrypt.hash(adminData.password, 10)
                    bcrypt.compare(adminData.password, admin.password).then((status) => {
                        if (status) {
                            console.log('login success');
                            response.admin = admin
                            response.status = true
                            resolve(response)
                        } else {
                            console.log('login failed');
                            resolve({ status: false })
                        }
                    })

                } else {
                    console.log('log Failed');
                    resolve({ status: false })
                }
            } catch (error) {
                reject(error)
            }

        })
    },



    //user block and active

    blockUser: (userId) => {
        console.log(userId)
        return new Promise((resolve, reject) => {
            try {
                db.get().collection('user').updateOne({ _id: ObjectId(userId) }, { $set: { block: true } }).then(() => {
                    resolve()
                })
            } catch (error) {
                reject(error)
            }

        })
    },

    activeUser: (userId) => {
        console.log(userId)
        return new Promise((resolve, reject) => {
            try {
                db.get().collection('user').updateOne({ _id: ObjectId(userId) }, { $set: { block: false } }).then(() => {
                    resolve()
                })
            } catch (error) {
                reject(error)
            }

        })
    },


    viewAllOrders: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let viewAllOrders = db.get().collection('orders').find().toArray()
                console.log(viewAllOrders, "viewAllOrders");
                resolve(viewAllOrders)
            } catch (error) {
                reject(error)
            }

        })
    }





}