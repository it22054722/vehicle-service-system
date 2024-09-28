const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Trainee');
const ScheduleModel = require('./models/ScheduleModel'); // Import the schedule model
const ProgressModel = require('./models/ProgressModel'); // Import the Progress model

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/trainee_management");

// GET all trainees
app.get('/', (req, res) => {
    UserModel.find({})
        .then(trainees => res.json(trainees))
        .catch(err => res.json(err));
});

// GET a specific trainee by ID
app.get('/getTrainee/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findById({ _id: id })
        .then(trainees => res.json(trainees))
        .catch(err => res.json(err));
});

// UPDATE a trainee by ID
app.put('/updateTrainee/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndUpdate(
        { _id: id },
        {
            trainee_id: req.body.trainee_id,
            name: req.body.name,
            age: req.body.age,
            trainee_periode: req.body.trainee_periode,
            email: req.body.email,
            phone_number: req.body.phone_number
        }
    )
        .then(trainees => res.json(trainees))
        .catch(err => res.json(err));
});

// DELETE a trainee by ID
app.delete('/deleteTrainee/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete({ _id: id })
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

// CREATE a new trainee
app.post("/createTrainee", (req, res) => {
    UserModel.create(req.body)
        .then(trainees => res.json(trainees))
        .catch(err => res.json(err));
});

// ---- SCHEDULE ROUTES ----

// CREATE a new schedule
app.post("/createSchedule", (req, res) => {
    const newSchedule = new ScheduleModel({
        date: req.body.date,
        timeSlot1: req.body.timeSlot1,
        availability1: req.body.availability1,
        timeSlot2: req.body.timeSlot2,
        availability2: req.body.availability2,
        timeSlot3: req.body.timeSlot3,
        availability3: req.body.availability3,
        task: req.body.task,
        trainee_id: req.body.trainee_id // The trainee ID is passed here
    });

    newSchedule.save()
        .then(schedule => res.json(schedule))
        .catch(err => res.json(err));
});

// GET all schedules
app.get('/schedules', (req, res) => {
    ScheduleModel.find({})
        .populate('trainee_id') // This populates the trainee_id field with trainee details
        .then(schedules => res.json(schedules))
        .catch(err => res.json(err));
});

// DELETE a schedule by ID
app.delete('/deleteSchedule/:id', (req, res) => {
    const id = req.params.id;
    ScheduleModel.findByIdAndDelete({ _id: id })
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

// ---- PROGRESS ROUTES ----

// CREATE progress record
app.post("/createProgress", (req, res) => {
    const newProgress = new ProgressModel({
      trainee_id: req.body.trainee_id,
      attendance: req.body.attendance,
      tasks: req.body.tasks,
    });
  
    newProgress.save()
      .then(progress => res.json(progress))
      .catch(err => res.json(err));
  });
  
  // GET progress by trainee ID
  app.get("/getProgress/:trainee_id", (req, res) => {
    const traineeId = req.params.trainee_id;
    ProgressModel.findOne({ trainee_id: traineeId })
      .then(progress => res.json(progress))
      .catch(err => res.json(err));
  });
  
  // UPDATE progress by trainee ID
  app.put("/updateProgress/:trainee_id", (req, res) => {
    const traineeId = req.params.trainee_id;
    ProgressModel.findOneAndUpdate(
      { trainee_id: traineeId },
      {
        attendance: req.body.attendance,
        tasks: req.body.tasks,
      },
      { new: true }
    )
      .then(progress => res.json(progress))
      .catch(err => res.json(err));
  });
  
  // DELETE progress by trainee ID
  app.delete("/deleteProgress/:trainee_id", (req, res) => {
    const traineeId = req.params.trainee_id;
    ProgressModel.findOneAndDelete({ trainee_id: traineeId })
      .then(response => res.json(response))
      .catch(err => res.json(err));
  });

// Start the server
app.listen(3001, () => {
    console.log("Server is Running");
});
