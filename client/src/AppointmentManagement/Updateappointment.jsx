import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import './updateappointment.css'; // Importing custom CSS

function Updateappointment() {
  const { id } = useParams();
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
  const [otherService, setOtherService] = useState(""); // For custom service
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [Phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [initialValues, setInitialValues] = useState({});
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
    "Other": 0, // Custom price for 'Other'
  };

  const calculateTotalCost = () => {
    let total = 0;
    for (let service in serviceTypes) {
      if (serviceTypes[service]) {
        total += servicePrices[service] || 0;
      }
    }
    setTotalCost(total);
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

  const fetchVehicleModels = () => {
    axios.get("http://localhost:3001/VehicleModels")
      .then(result => setVehicleModels(result.data))
      .catch(err => console.log(err));
  };

  const fetchBookedAppointments = (date, selectedServices) => {
    if (date && selectedServices.length > 0) {
      axios
        .get(`http://localhost:3001/BookedAppointments/${date}/${selectedServices.join(",")}`)
        .then(result => setBookedAppointments(result.data))
        .catch(err => console.log(err));
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/appointments/${id}`)
      .then(result => {
        const appointment = result.data;
        setCustomerName(appointment.customerName);
        setVehicleModel(appointment.vehicleModel);
        setServiceTypes(serviceTypes => {
          const updatedTypes = { ...serviceTypes };
          appointment.serviceType.forEach(service => {
            if (updatedTypes[service] !== undefined) {
              updatedTypes[service] = true;
            } else {
              setOtherService(service);
              updatedTypes["Other"] = true;
            }
          });
          return updatedTypes;
        });
        setAppointmentDate(appointment.appointmentDate);
        setAppointmentTime(appointment.appointmentTime);
        setPhonenumber(appointment.Phonenumber);
        setEmail(appointment.email);
        setInitialValues(appointment);
      })
      .catch(err => console.log(err));

    fetchVehicleModels();
  }, [id]);

  useEffect(() => {
    const selectedServices = Object.keys(serviceTypes).filter(service => serviceTypes[service]);
    fetchBookedAppointments(appointmentDate, selectedServices);
    calculateTotalCost();
  }, [appointmentDate, serviceTypes]);

  const isTimeSlotAvailable = (time) => {
    return !bookedAppointments.some(appointment => appointment.appointmentTime === time);
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

  useEffect(() => {
    if (appointmentDate && Object.values(serviceTypes).some(Boolean)) {
      updateAvailableTimes();
    }
  }, [appointmentDate, bookedAppointments, serviceTypes]);

  const hasChanges = () => {
    return (
      customerName !== initialValues.customerName ||
      vehicleModel !== initialValues.vehicleModel ||
      JSON.stringify(serviceTypes) !== JSON.stringify(initialValues.serviceType) ||
      appointmentDate !== initialValues.appointmentDate ||
      appointmentTime !== initialValues.appointmentTime ||
      Phonenumber !== initialValues.Phonenumber ||
      email !== initialValues.email
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) return;

    if (!hasChanges()) {
      Swal.fire({
        icon: 'info',
        title: 'No Changes Detected',
        text: 'There are no changes to save.',
      });
      return;
    }

    const selectedServices = Object.keys(serviceTypes).filter(service => serviceTypes[service]);

    if (serviceTypes["Other"] && !otherService.trim()) {
      setErrorMessage("Please specify the 'Other' service.");
      return;
    }

    axios.put(`http://localhost:3001/Updateappointments/${id}`, {
      customerName,
      vehicleModel,
      serviceType: [...selectedServices, otherService].filter(Boolean),
      appointmentDate,
      appointmentTime,
      Phonenumber,
      email,
    })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Appointment Updated',
          text: 'The appointment has been updated successfully!',
        }).then(() => {
          navigate("/AppTable");
        });
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Cannot update appointment after 24 hours.',
        });
        console.log(err);
      });
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center">
      <div className="card update-user-card">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-4 appointment-heading">Update Appointment</h2>

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
                    onChange={(e) => {
                      setServiceTypes({
                        ...serviceTypes,
                        [service]: e.target.checked,
                      });
                    }}
                  />
                  <label className="form-check-label" htmlFor={service}>
                    {service} {servicePrices[service] ? ` - $${servicePrices[service]}` : ""}
                  </label>
                </div>
              ))}
              {serviceTypes["Other"] && (
                <div className="mt-2">
                  <label htmlFor="otherService" className="form-label">Other Service</label>
                  <input
                    type="text"
                    className="form-control"
                    id="otherService"
                    value={otherService}
                    onChange={(e) => setOtherService(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

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

          {/* Display total cost */}
          <div className="form-group mb-3">
            <label className="form-label">Total Cost</label>
            <p className="form-control">
              ${totalCost}
            </p>
          </div>

          <button type="submit" className="btn btn-primary w-100">Update Appointment</button>
        </form>
      </div>
    </div>
  );
}

export default Updateappointment;
