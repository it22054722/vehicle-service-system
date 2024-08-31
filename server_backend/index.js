const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const UserModel = require('./models/Trainee')

const app = express()
app.use(cors())

app.use(express.json())

mongoose.connect("mongodb://localhost:27017/trainee_management")

app.get('/',(req, res) =>{
    UserModel.find({})
    .then(trainees => res.json(trainees))
    .catch(err => res.json(err))
})


app.post("/createTrainee", (req,res) =>{

    UserModel.create(req.body)
    .then(trainees => res.json(trainees))
    .catch(err => res.json(err))
})




app.listen(3001, () =>{
    console.log("Server is Running")
})