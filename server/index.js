const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ServiceModel = require('./models/Services')

const app  = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://paman:paman2001@cluster04.w0x6oir.mongodb.net")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

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


const UserModel = require('./Models/Users');
const Attendance = require('./Models/Attendance'); // Import Attendance model

// Route to get all users
app.get('/', (req, res) => {
    UserModel.find({})
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

// login with password and email address
app.post("/login", (req, res) => {
    const {email, password} = req.body;
    UserModel.findOne()
    .then(user => {
        if(user){
            if(user.password === password){
                res.json("Login Successfully")
            }
            else {
                res.json("The password is incorrect")
            }
        } else {

            res.json("No recorded existed")
        }
    })
})

// Route to get a single user by ID
app.get('/getUser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findById({ _id: id })
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

// Route to update a user by ID
app.put('/updateUser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndUpdate(
        { _id: id },
        { name: req.body.name, date: req.body.date, nic: req.body.nic, contact: req.body.contact, email: req.body.email, position: req.body.position }
    )
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

// Route to delete a user by ID with cascade delete for related records
app.delete('/deleteUser/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Delete user
        const deletedUser = await UserModel.findByIdAndDelete({ _id: id });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cascade delete: Remove related attendance records for this user
        await Attendance.deleteMany({ employeeId: id });

        // You can add more schemas for cascading deletion if needed
        // For example: await OtherModel.deleteMany({ employeeId: id });

        res.json({ message: 'User and related records deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete user and related records' });
    }
});

// Route to create a new user

app.post("/CreateUser", async (req, res) => {
  try {
      const existingUser = await UserModel.findOne({ nic: req.body.nic });
      
      if (existingUser) {
          return res.status(400).json({ message: 'NIC already exists. Please use a different NIC.' });
      }
      
      const user = await UserModel.create(req.body);
      res.json(user);
  } catch (err) {
      res.status(500).json(err);
  }
});

// Route to mark attendance
app.post('/markAttendance', async (req, res) => {
    const { employeeId, date, status, overtimeHours } = req.body;

    if (!employeeId || !date || !status) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        // Check if attendance exists for this employee on the given date
        let existingAttendance = await Attendance.findOne({ employeeId, date });

        if (existingAttendance) {
            // If attendance already exists, do not allow marking again
            return res.status(400).json({ message: 'Attendance for this employee has already been marked for this date.' });
        }

        // Create a new attendance record
        const newAttendance = new Attendance({
            employeeId,
            date,
            status,
            overtimeHours: overtimeHours || 0
        });
        await newAttendance.save();

        res.status(200).json({ message: 'Attendance marked successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to mark attendance.' });
    }
});




// Route to mark attendance
app.post('/markAttendance', async (req, res) => {
    const { employeeId, date, status, overtimeHours } = req.body;

    if (!employeeId || !date || !status) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        // Check if attendance exists for this employee on the given date
        let existingAttendance = await Attendance.findOne({ employeeId, date });

        if (existingAttendance) {
            // Update existing attendance with status and OT hours
            existingAttendance.status = status;
            existingAttendance.overtimeHours = overtimeHours || 0; // Update OT hours if provided
            await existingAttendance.save();
        } else {
            // Create a new attendance record
            const newAttendance = new Attendance({
                employeeId,
                date,
                status,
                overtimeHours: overtimeHours || 0
            });
            await newAttendance.save();
        }

        res.status(200).json({ message: 'Attendance marked successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to mark attendance.' });
    }
});

// Route to get attendance records (you can implement it if needed)
app.get('/attendanceRecords', (req, res) => {
    Attendance.find({})
        .then(attendance => res.json(attendance))
        .catch(err => res.json(err));
});



// Route to get attendance records by employee NIC
app.get('/attendanceRecordsByNIC', async (req, res) => {
    const { nic } = req.query;

    if (!nic) {
        return res.status(400).json({ message: 'NIC is required' });
    }

    try {
        // Find the employee by NIC
        const employee = await UserModel.findOne({ nic });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Fetch attendance records for the employee
        const attendanceRecords = await Attendance.find({ employeeId: employee._id });

        res.json(attendanceRecords);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve attendance records' });
    }
});


// Start the server
app.listen(3001, () => {
    console.log("Server is Running");
});


const UserModel = require('./models/Trainee');
const ScheduleModel = require('./models/ScheduleModel'); // Import the schedule model
const ProgressModel = require('./models/ProgressModel'); // Import the Progress model



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
