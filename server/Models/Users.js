const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:String,
    date:String,
    nic:String,
    contact:String,
    email:String,
    position:String
})

const UserModel = mongoose.model("user_information", UserSchema)
module.exports = UserModel