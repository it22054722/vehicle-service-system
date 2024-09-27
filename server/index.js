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



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./Models/Users');
const Attendance = require('./Models/Attendance'); // Import Attendance model

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Employee_Management")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

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
