const mongoose = require ('mongoose')
const UserShema = new mongoose.Schema({
    serviceId:String,
    service: String,
    date: String,
    vin: String,
    price: Number,
    parts: String,
    quantity: Number,
    notes: String,
    status:String
})

const ServiceModel = mongoose.model("Service_Records",UserShema)
module.exports = ServiceModel