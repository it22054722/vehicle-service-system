const { time } = require('console')
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  customerName: String,
  vehicleModel: String,
  serviceType: [String], // Change to accept an array of strings
  appointmentDate: String,
  appointmentTime: String,
  Phonenumber: String,
  email: String,
  createdAt: { type: Date, default: Date.now }, // Add this line
});

const UserModel = mongoose.model("user_information", UserSchema);
module.exports = UserModel;

