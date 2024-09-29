const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./Models/Users');
const jsPDF = require('jspdf');
const autoTable = require('jspdf-autotable');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/');

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
        UserModel.create(req.body)
          .then(user => res.json(user))
          .catch(err => res.status(500).json(err));
      }
    })
    .catch(err => res.status(500).json(err));
});


// Function to generate an invoice PDF
const generateInvoice = (user) => {
  const doc = new jsPDF();

  // Header
  doc.text("Invoice", 20, 10);
  doc.text("Vehicle Service Management", 20, 20);

  // User details
  doc.text(`Customer Name: ${user.customerName}`, 20, 30);
  doc.text(`Vehicle Model: ${user.vehicleModel}`, 20, 40);
  doc.text(`Service Type: ${user.serviceType}`, 20, 50);
  doc.text(`Appointment Date: ${user.appointmentDate}`, 20, 60);
  doc.text(`Appointment Time: ${user.appointmentTime}`, 20, 70);
  doc.text(`Phone Number: ${user.Phonenumber}`, 20, 80);
  doc.text(`Email: ${user.email}`, 20, 90);

  // Auto table for services (you can add more rows for detailed services)
  autoTable(doc, {
    head: [['Service Type', 'Price']],
    body: [
      [user.serviceType, "$100"], // Example price, adjust accordingly
    ],
  });

  // Footer
  doc.text(`Total: $100`, 20, 120); // Example total

  // Save the file
  const filePath = path.join(__dirname, 'invoices', `invoice_${user._id}.pdf`);
  doc.save(filePath);
  return filePath;
};

// Fetch booked times for a specific service type on a specific date
app.get('/BookedTimes/:date/:serviceType', (req, res) => {
  const { date, serviceType } = req.params;

  // Find booked times for the given date and service type
  UserModel.find({ appointmentDate: date, serviceType })
    .then(users => {
      const bookedTimesCount = {};

      // Count occurrences of each time slot for the service
      users.forEach(user => {
        const time = user.appointmentTime;
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

  UserModel.find({})
    .then(users => {
      // Filter users to exclude bookings made within the last hour
      const availableAppointments = users.filter(user => {
        const appointmentTime = new Date(user.appointmentDate + 'T' + user.appointmentTime); // Combine date and time
        const timeDifference = appointmentTime.getTime() - now.getTime();
        const hoursDifference = timeDifference / (1000 * 3600); // Convert time difference to hours
        return hoursDifference > 1; // Only show appointments if they are more than 1 hour away
      });
      res.json(availableAppointments);
    })
    .catch(err => res.json(err));
});

app.get('/appointments/:id', (req, res) => {
  UserModel.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

app.put('/Updateappointments/:id', (req, res) => {
  const validationErrors = validateUserInput(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ message: validationErrors.join(", ") });
  }

  UserModel.findById(req.params.id)
    .then(user => {
      const now = new Date();
      const createdAt = user.createdAt; // Assuming you have a createdAt field in your user model
      const timeDifference = now - createdAt; // Time difference in milliseconds
      const hoursDifference = timeDifference / (1000 * 3600); // Convert to hours

      if (hoursDifference > 24) {
        return res.status(403).json({ message: 'Cannot update appointment after 24 hours.' });
      }

      const updates = {};
      if (user.customerName !== req.body.customerName) updates.customerName = req.body.customerName;
      if (user.vehicleModel !== req.body.vehicleModel) updates.vehicleModel = req.body.vehicleModel;
      if (JSON.stringify(user.serviceType) !== JSON.stringify(req.body.serviceType)) updates.serviceType = req.body.serviceType;
      if (user.appointmentDate !== req.body.appointmentDate) updates.appointmentDate = req.body.appointmentDate;
      if (user.appointmentTime !== req.body.appointmentTime) updates.appointmentTime = req.body.appointmentTime;
      if (user.Phonenumber !== req.body.Phonenumber) updates.Phonenumber = req.body.Phonenumber;
      if (user.email !== req.body.email) updates.email = req.body.email;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No changes detected' });
      }

      UserModel.findByIdAndUpdate(req.params.id, updates, { new: true })
        .then(updatedUser => res.json(updatedUser))
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});



app.delete('/Deleteappointments/:id', (req, res) => {
  UserModel.findById(req.params.id)
    .then(user => {
      const now = new Date();
      const createdAt = user.createdAt; // Get the createdAt timestamp
      const timeDifference = now - createdAt; // Time difference in milliseconds
      const hoursDifference = timeDifference / (1000 * 3600); // Convert to hours

      if (hoursDifference > 24) {
        return res.status(403).json({ message: 'Cannot delete appointment after 24 hours.' });
      }

      // Return the promise directly after checking the time difference
      return UserModel.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});

app.listen(3001, () => {
  console.log("Server is Running");
});
