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
  });
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [Phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [vehicleModels, setVehicleModels] = useState([]);
  const navigate = useNavigate();

  const servicePrices = {
    "Full Service": 100,
    "Bodywash": 50,
    "Oil Change": 70,
    "Engine Check": 120,
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

  const fetchBookedTimes = (appointmentDate) => {
    if (appointmentDate) {
      axios.get(`http://localhost:3001/BookedTimes/${appointmentDate}`)
        .then((result) => {
          setBookedTimes(result.data);
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
    fetchBookedTimes(appointmentDate);
  }, [appointmentDate]);

  const handleWhatsAppMessage = () => {
    const message = `Appointment Details:
    Customer Name: ${customerName}
    Vehicle Model: ${vehicleModel}
    Services: ${Object.keys(serviceTypes).filter(service => serviceTypes[service]).join(", ")}
    Appointment Date: ${appointmentDate}
    Appointment Time: ${appointmentTime}
    Phone Number: ${Phonenumber}
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
    const totalPrice = selectedServices.reduce((total, service) => total + servicePrices[service], 0);

    axios
      .post("http://localhost:3001/Createappointment", {
        customerName,
        vehicleModel,
        serviceType: selectedServices,
        appointmentDate,
        appointmentTime,
        Phonenumber,
        email,
        servicePrice: totalPrice,
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

  const renderAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      times.push(time);
    }

    return times.map((time) => (
      <option key={time} value={time} disabled={bookedTimes.includes(time)}>
        {time}
      </option>
    ));
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center">
      <div className="card create-user-card">
        <form onSubmit={Submit}>
        <h2 className="text-center mb-4 appointment-heading">Create Appointment</h2>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          
          {/* Customer Name Input */}
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

          {/* Vehicle Model Dropdown */}
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

          {/* Service Types Checkboxes */}
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
                    onChange={(e) => {
                      setServiceTypes({
                        ...serviceTypes,
                        [service]: e.target.checked,
                      });
                    }}
                  />
                  <label className="form-check-label" htmlFor={service}>
                    {service} - ${servicePrices[service]}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Date and Time */}
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
              {renderAvailableTimes()}
            </select>
            {validationErrors.appointmentTime && <div className="text-danger">{validationErrors.appointmentTime}</div>}
          </div>

          {/* Phone Number and Email */}
          <div className="form-group mb-3">
            <label htmlFor="Phonenumber" className="form-label">Phone Number</label>
            <input
              type="text"
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

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="btn btn-success w-40 mt-3">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Createappointment;
