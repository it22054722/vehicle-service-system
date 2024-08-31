const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ServiceModel = require('./models/Services')

const app  = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/Service_Records_Management")

app.get('/', (req,res) => {
    ServiceModel.find({})
    .then(services => res.json(services))
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