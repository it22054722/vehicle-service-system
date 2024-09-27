const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ServiceModel = require('./models/Services')

const app  = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/Service_Records_Management")

app.get('/Services', (req,res) => {
    ServiceModel.find({})
    .then(services => res.json(services))
    .catch(err => res.json(err))
})

app.get('/getService/:id',(req, res) => {
    const id = req.params.id;
    ServiceModel.findById({_id:id})
    .then(services => res.json(services))
    .catch(err => res.json(err))
})


app.put('/updateService/:id',(req,res) => {
    const id = req.params.id;
    ServiceModel.findByIdAndUpdate({_id: id}, {
        service: req.body.service, 
        date: req.body.date,
        vin:req.body.vin,
        price:req.body.price,
        parts:req.body.parts,
        quantity: Number(req.body.quantity),
        notes:req.body.notes
    })
    .then(services => res.json(services))
    .catch(err => res.json(err))
})


app.delete('/deleteService/:id',(req,res) => {
    const id = req.params.id;
    ServiceModel.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
})


app.post("/createService", (req,res) => {
    ServiceModel.create(req.body)
    .then(services => res.json(services))
    .catch(err => res.json(err))
})

app.listen(3001, () => {
    console.log("server is running")
})


