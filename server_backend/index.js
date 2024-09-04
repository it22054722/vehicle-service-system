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


app.get('/getTrainee/:id',(req,res) => {
    const id = req.params.id;
    UserModel.findById({_id:id})
    .then(trainees => res.json(trainees))
    .catch(err => res.json(err))
})

app.put('/updateTrainee/:id',(req,res) =>{
    const id = req.params.id;
    UserModel.findByIdAndUpdate({_id:id},
                                {trainee_id: req.body.trainee_id,
                                 name: req.body.name,
                                 age: req.body.age,
                                 trainee_periode: req.body.trainee_periode ,
                                 email: req.body.email,
                                 phone_number: req.body.phone_number  
                                })
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