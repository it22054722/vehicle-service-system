import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Createappointment.css'; // Import custom styles

function Createappointment() {
  const [customerName, setCustomerName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [serviceTypes, setServiceTypes] = useState({
    "Full Service": false,
    "Bodywash": false,
    "Oil Change": false,
    "Engine Check": false,
    "Hybrid Service": false,
    "Wheel Alignment": false,
    "Battery Services": false,
    "Part Replacements": false,
    "Engine Tune Ups": false,
    "Other": false,
  });
  const [otherService, setOtherService] = useState(""); // To store custom service
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [Phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [totalCost, setTotalCost] = useState(0); // New state for total cost
  const navigate = useNavigate();

  const servicePrices = {
    "Full Service": 4000,
    "Bodywash": 1500,
    "Oil Change": 8000,
    "Engine Check": 2000,
    "Hybrid Service": 10000,
    "Wheel Alignment": 1000,
    "Battery Services": 2000,
    "Part Replacements": 5000,
    "Engine Tune Ups": 10000,
    "Other": 0, // Custom price for 'Other' will be manually defined
  };

  const validate = () => {
    const errors = {};
    if (!customerName.trim() || !/^[a-zA-Z\s]+$/.test(customerName)) {
      errors.customerName = "Customer name is required and should only contain letters.";
    }
    if (!vehicleModel.trim()) {
      errors.vehicleModel = "Vehicle model is required.";
    }
    if (!appointmentDate) {
      errors.appointmentDate = "Appointment date is required.";
    }
    if (!appointmentTime) {
      errors.appointmentTime = "Appointment time is required.";
    }
    if (!/^\d{10}$/.test(Phonenumber)) {
      errors.Phonenumber = "Phone number must be a valid 10-digit number.";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email must be a valid email address.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchBookedAppointments = (date, selectedServices) => {
    if (date && selectedServices.length > 0) {
      axios
        .get(`http://localhost:3001/BookedAppointments/${date}/${selectedServices.join(",")}`)
        .then((result) => {
          setBookedAppointments(result.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const fetchVehicleModels = () => {
    const models = ["Toyota Corolla", "Honda Civic", "Ford F-150", "Tesla Model S", "BMW 3 Series"];
    setVehicleModels(models);
  };

  useEffect(() => {
    fetchVehicleModels();
  }, []);

  useEffect(() => {
    const selectedServices = Object.keys(serviceTypes).filter(service => serviceTypes[service]);
    fetchBookedAppointments(appointmentDate, selectedServices);
  }, [appointmentDate, serviceTypes]);

  useEffect(() => {
    if (appointmentDate && Object.values(serviceTypes).some(Boolean)) {
      updateAvailableTimes();
    }
  }, [appointmentDate, bookedAppointments, serviceTypes]);

  const isTimeSlotAvailable = (time) => {
    return !bookedAppointments.some((appointment) => appointment.appointmentTime === time);
  };

  const updateAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      if (isTimeSlotAvailable(time)) {
        times.push(time);
      }
    }
    setAvailableTimes(times);
  };

  const calculateTotalCost = () => {
    const selectedServices = Object.keys(serviceTypes).filter(service => serviceTypes[service]);
    const total = selectedServices.reduce((total, service) => total + servicePrices[service], 0);
    setTotalCost(total);
  };

  useEffect(() => {
    calculateTotalCost(); // Update total cost when services change
  }, [serviceTypes]);

  const handleWhatsAppMessage = () => {
    const selectedServices = Object.keys(serviceTypes).filter(service => serviceTypes[service]);
    const message = `Appointment Details:\n
    Customer Name: ${customerName}\n
    Vehicle Model: ${vehicleModel}\n
    Services: ${selectedServices.join(", ") + (serviceTypes["Other"] && otherService ? `, ${otherService}` : "")}\n
    Appointment Date: ${appointmentDate}\n
    Appointment Time: ${appointmentTime}\n
    Phone Number: ${Phonenumber}\n
    totalCost: ${totalCost}\n
    Email: ${email}`;

    const whatsappNumber = "+94705225121"; // Example phone number
    const whatsappURL = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  };

  const Submit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) return;

    const selectedServices = Object.keys(serviceTypes).filter((service) => serviceTypes[service]);

    if (serviceTypes["Other"] && !otherService.trim()) {
      setErrorMessage("Please specify the 'Other' service.");
      return;
    }

    if (!isTimeSlotAvailable(appointmentTime)) {
      setErrorMessage("The selected time is already booked for the chosen services. Please select a different time.");
      return;
    }

    axios
      .post("http://localhost:3001/Createappointment", {
        customerName,
        vehicleModel,
        serviceType: [...selectedServices, otherService].filter(Boolean),
        appointmentDate,
        appointmentTime,
        Phonenumber,
        email,
        totalCost, // Send total cost with the appointment
      })
      .then((result) => {
        handleWhatsAppMessage(); // Call the function to send the WhatsApp message
        navigate("/");
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("An error occurred while creating the appointment.");
        }
      });
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center">
      <div className="card create-user-card">
        <form onSubmit={Submit}>
          <h2 className="text-center mb-4 appointment-heading">Appointment Reservation</h2>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <div className="form-group mb-3">
            <label htmlFor="customerName" className="form-label">Customer Name</label>
            <input
              type="text"
              className="form-control"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            {validationErrors.customerName && <div className="text-danger">{validationErrors.customerName}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="vehicleModel" className="form-label">Vehicle Model</label>
            <select
              className="form-select"
              id="vehicleModel"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
            >
              <option value="">Select a vehicle model</option>
              {vehicleModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            {validationErrors.vehicleModel && <div className="text-danger">{validationErrors.vehicleModel}</div>}
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Service Type</label>
            <div className="service-types">
              {Object.keys(serviceTypes).map((service) => (
                <div key={service} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={service}
                    checked={serviceTypes[service]}
                    onChange={(e) => setServiceTypes({ ...serviceTypes, [service]: e.target.checked })}
                  />
                  <label htmlFor={service} className="form-check-label">
                    {service} - ${servicePrices[service] || "Custom"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {serviceTypes["Other"] && (
            <div className="form-group mb-3">
              <label htmlFor="otherService" className="form-label">Specify Other Service</label>
              <input
                type="text"
                className="form-control"
                id="otherService"
                value={otherService}
                onChange={(e) => setOtherService(e.target.value)}
              />
            </div>
          )}

          <div className="form-group mb-3">
            <label htmlFor="appointmentDate" className="form-label">Appointment Date</label>
            <input
              type="date"
              className="form-control"
              id="appointmentDate"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
            {validationErrors.appointmentDate && <div className="text-danger">{validationErrors.appointmentDate}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="appointmentTime" className="form-label">Appointment Time</label>
            <select
              className="form-select"
              id="appointmentTime"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            >
              <option value="">Select a time</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {validationErrors.appointmentTime && <div className="text-danger">{validationErrors.appointmentTime}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="Phonenumber" className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="Phonenumber"
              value={Phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
            />
            {validationErrors.Phonenumber && <div className="text-danger">{validationErrors.Phonenumber}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {validationErrors.email && <div className="text-danger">{validationErrors.email}</div>}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="totalCost" className="form-label">Total Cost</label>
            <input
              type="text"
              className="form-control"
              id="totalCost"
              value={`$${totalCost}`}
              readOnly
            />
          </div>

          <div className="alert alert-warning mt-3">
              It is not possible to update or delete the appointment after 24 hours of booking.
            </div>

          <button type="submit" className="btn btn-primary w-100">Book Appointment</button>
        </form>
      </div>
    </div>
  );
}

export default Createappointment;
