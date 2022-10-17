const db = require('../config/connection')
const collection = require('../config/collection')
const { response } = require('../app')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')

module.exports = {



    //admin login

    doAdminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
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
        })
    },



    //user block and active

    blockUser: (userId) => {
        console.log(userId)
        return new Promise((resolve, reject) => {
            db.get().collection('user').updateOne({ _id: ObjectId(userId) }, { $set: { block: true } }).then(() => {
                resolve()
            })
        })
    },

    activeUser: (userId) => {
        console.log(userId)
        return new Promise((resolve, reject) => {
            db.get().collection('user').updateOne({ _id: ObjectId(userId) }, { $set: { block: false } }).then(() => {
                resolve()
            })
        })
    }



}