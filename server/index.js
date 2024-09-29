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





const TraineeModel = require('./models/Trainee');
const ScheduleModel = require('./models/ScheduleModel'); // Import the schedule model
const ProgressModel = require('./models/ProgressModel'); // Import the Progress model



// GET all trainees
app.get('/trainees', (req, res) => {
    TraineeModel.find({})
        .then(trainees => res.json(trainees))
        .catch(err => res.json(err));
});

// GET a specific trainee by ID
app.get('/getTrainee/:id', (req, res) => {
    const id = req.params.id;
    TraineeModel.findById({ _id: id })
        .then(trainees => res.json(trainees))
        .catch(err => res.json(err));
});

// UPDATE a trainee by ID
app.put('/updateTrainee/:id', (req, res) => {
    const id = req.params.id;
    TraineeModel.findByIdAndUpdate(
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
    TraineeModel.findByIdAndDelete({ _id: id })
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

// CREATE a new trainee
app.post("/createTrainee", (req, res) => {
    TraineeModel.create(req.body)
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




const appointmentModel = require('./Models/appointment');
const jsPDF = require('jspdf');
const autoTable = require('jspdf-autotable');
const path = require('path');



// Validation function
const validateUserInput = (userData) => {
  const { customerName, vehicleModel, serviceType, appointmentDate, appointmentTime, Phonenumber, email } = userData;
  const errors = [];

  // Validate required fields
  if (!customerName || customerName.trim() === "") errors.push("Customer Name is required");
  if (!vehicleModel || vehicleModel.trim() === "") errors.push("Vehicle Model is required");
  if (!serviceType || serviceType.length === 0) errors.push("At least one Service Type is required");
  if (!appointmentDate || appointmentDate.trim() === "") errors.push("Appointment Date is required");
  if (!appointmentTime || appointmentTime.trim() === "") errors.push("Appointment Time is required");

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) errors.push("Valid Email is required");

  // Validate phone number (simple validation for 10-digit numbers)
  const phoneRegex = /^\d{10}$/;
  if (!Phonenumber || !phoneRegex.test(Phonenumber)) errors.push("Valid 10-digit Phone Number is required");

  return errors;
};

// Check for existing appointment before creating a new one
app.post("/Createappointment", (req, res) => {
  const { serviceType, appointmentDate, appointmentTime } = req.body;
  
  const selectedAppointment = new Date(`${appointmentDate}T${appointmentTime}:00`);

  // Check each selected service type for conflicts
  const serviceConflictPromises = serviceType.map(type => 
    UserModel.find({
      serviceType: type, // Only check for the same service type
      appointmentDate,
      appointmentTime: {
        $gte: new Date(selectedAppointment.getTime() - 60 * 60 * 1000), // 1 hour before
        $lte: new Date(selectedAppointment.getTime() + 60 * 60 * 1000)  // 1 hour after
      }
    })
  );

  Promise.all(serviceConflictPromises)
    .then(conflictArrays => {
      // Flatten the arrays and check for more than 3 conflicts
      const conflicts = conflictArrays.flat();
      if (conflicts.length > 3) {
        return res.status(400).json({ 
          message: `Sorry, there are already 3 bookings for one of the selected services at ${appointmentTime}. Please select another time.` 
        });
      } else {
        appointmentModel.create(req.body)
          .then(appointment => res.json(appointment))
          .catch(err => res.status(500).json(err));
      }
    })
    .catch(err => res.status(500).json(err));
});


// Function to generate an invoice PDF
const generateInvoice = (appointment) => {
  const doc = new jsPDF();

  // Header
  doc.text("Invoice", 20, 10);
  doc.text("Vehicle Service Management", 20, 20);

  // User details
  doc.text(`Customer Name: ${appointment.customerName}`, 20, 30);
  doc.text(`Vehicle Model: ${appointment.vehicleModel}`, 20, 40);
  doc.text(`Service Type: ${appointment.serviceType}`, 20, 50);
  doc.text(`Appointment Date: ${appointment.appointmentDate}`, 20, 60);
  doc.text(`Appointment Time: ${appointment.appointmentTime}`, 20, 70);
  doc.text(`Phone Number: ${appointment.Phonenumber}`, 20, 80);
  doc.text(`Email: ${appointment.email}`, 20, 90);

  // Auto table for services (you can add more rows for detailed services)
  autoTable(doc, {
    head: [['Service Type', 'Price']],
    body: [
      [appointment.serviceType, "$100"], // Example price, adjust accordingly
    ],
  });

  // Footer
  doc.text(`Total: $100`, 20, 120); // Example total

  // Save the file
  const filePath = path.join(__dirname, 'invoices', `invoice_${appointment._id}.pdf`);
  doc.save(filePath);
  return filePath;
};

// Fetch booked times for a specific service type on a specific date
app.get('/BookedTimes/:date/:serviceType', (req, res) => {
  const { date, serviceType } = req.params;

  // Find booked times for the given date and service type
  appointmentModel.find({ appointmentDate: date, serviceType })
    .then(appointment => {
      const bookedTimesCount = {};

      // Count occurrences of each time slot for the service
      appointment.forEach(appointment => {
        const time =appointmentappointment.appointmentTime;
        if (!bookedTimesCount[time]) {
          bookedTimesCount[time] = 0;
        }
        bookedTimesCount[time]++;
      });

      // Filter out times that have reached 3 bookings
      const fullyBookedTimes = Object.keys(bookedTimesCount).filter(time => bookedTimesCount[time] >= 3);
      
      res.json(fullyBookedTimes); // Return only fully booked times to be excluded
    })
    .catch(err => res.status(500).json(err));
});

app.get('/appointments', (req, res) => {
  const now = new Date();

  appointmentModel.find({})
    .then(appointment => {
      // Filter users to exclude bookings made within the last hour
      const availableAppointments = appointment.filter(appointment => {
        const appointmentTime = new Date(appointment.appointmentDate + 'T' + appointment.appointmentTime); // Combine date and time
        const timeDifference = appointmentTime.getTime() - now.getTime();
        const hoursDifference = timeDifference / (1000 * 3600); // Convert time difference to hours
        return hoursDifference > 1; // Only show appointments if they are more than 1 hour away
      });
      res.json(availableAppointments);
    })
    .catch(err => res.json(err));
});

app.get('/appointments/:id', (req, res) => {
  appointmentModel.findById(req.params.id)
    .then(appointment => res.json(appointment))
    .catch(err => res.json(err));
});

app.put('/Updateappointments/:id', (req, res) => {
  const validationErrors = validateUserInput(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ message: validationErrors.join(", ") });
  }

  appointmentModel.findById(req.params.id)
    .then(appointment => {
      const now = new Date();
      const createdAt = appointment.createdAt; // Assuming you have a createdAt field in your user model
      const timeDifference = now - createdAt; // Time difference in milliseconds
      const hoursDifference = timeDifference / (1000 * 3600); // Convert to hours

      if (hoursDifference > 24) {
        return res.status(403).json({ message: 'Cannot update appointment after 24 hours.' });
      }

      const updates = {};
      if (appointment.customerName !== req.body.customerName) updates.customerName = req.body.customerName;
      if (appointment.vehicleModel !== req.body.vehicleModel) updates.vehicleModel = req.body.vehicleModel;
      if (JSON.stringify(appointment.serviceType) !== JSON.stringify(req.body.serviceType)) updates.serviceType = req.body.serviceType;
      if (appointment.appointmentDate !== req.body.appointmentDate) updates.appointmentDate = req.body.appointmentDate;
      if (appointment.appointmentTime !== req.body.appointmentTime) updates.appointmentTime = req.body.appointmentTime;
      if (appointment.Phonenumber !== req.body.Phonenumber) updates.Phonenumber = req.body.Phonenumber;
      if (appointment.email !== req.body.email) updates.email = req.body.email;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No changes detected' });
      }

      appointmentModel.findByIdAndUpdate(req.params.id, updates, { new: true })
        .then(updatedappointment => res.json(updatedappointment))
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});



app.delete('/Deleteappointments/:id', (req, res) => {
  appointmentModel.findById(req.params.id)
    .then(appointment => {
      const now = new Date();
      const createdAt = appointment.createdAt; // Get the createdAt timestamp
      const timeDifference = now - createdAt; // Time difference in milliseconds
      const hoursDifference = timeDifference / (1000 * 3600); // Convert to hours

      if (hoursDifference > 24) {
        return res.status(403).json({ message: 'Cannot delete appointment after 24 hours.' });
      }

      // Return the promise directly after checking the time difference
      return appointmentModel.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});

app.listen(3001, () => {
  console.log("Server is Running");
});
