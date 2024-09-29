import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import './updateappointment.css'; // Importing custom CSS

function Updateappointment() {
  const { id } = useParams();
  const [customerName, setCustomerName] = useState("");
  const [vehicleModel, setVehicleModel] = useState(""); 
  const [serviceType, setServiceType] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [Phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]); 
  const navigate = useNavigate();

  const fetchBookedTimes = (appointmentDate, serviceType) => {
    if (appointmentDate && serviceType.length > 0) {
      axios.get(`http://localhost:3001/BookedTimes/${appointmentDate}/${serviceType[0]}`)
        .then(result => setBookedTimes(result.data))
        .catch(err => console.log(err));
    }
  };

  const fetchVehicleModels = () => {
    axios.get('http://localhost:3001/VehicleModels') 
      .then(result => setVehicleModels(result.data)) 
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (appointmentDate && serviceType.length > 0) {
      fetchBookedTimes(appointmentDate, serviceType[0]);
    }
  }, [appointmentDate, serviceType]);

  useEffect(() => {
    axios.get(`http://localhost:3001/appointments/${id}`)
      .then(result => {
        const user = result.data;
        setCustomerName(user.customerName);
        setVehicleModel(user.vehicleModel); 
        setServiceType(user.serviceType || []);
        setAppointmentDate(user.appointmentDate);
        setAppointmentTime(user.appointmentTime);
        setPhonenumber(user.Phonenumber);
        setEmail(user.email);
        setInitialValues(user);
      })
      .catch(err => console.log(err));

    fetchVehicleModels();
  }, [id]);

  const hasChanges = () => {
    return (
      customerName !== initialValues.customerName ||
      vehicleModel !== initialValues.vehicleModel ||
      JSON.stringify(serviceType) !== JSON.stringify(initialValues.serviceType) ||
      appointmentDate !== initialValues.appointmentDate ||
      appointmentTime !== initialValues.appointmentTime ||
      Phonenumber !== initialValues.Phonenumber ||
      email !== initialValues.email
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName || !vehicleModel || !appointmentDate || !appointmentTime || !Phonenumber || !email) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all fields.',
      });
      return;
    }

    if (!hasChanges()) {
      Swal.fire({
        icon: 'info',
        title: 'No Changes Detected',
        text: 'There are no changes to save.',
      });
      return;
    }

    axios.put(`http://localhost:3001/Updateappointments/${id}`, {
      customerName,
      vehicleModel,
      serviceType,
      appointmentDate,
      appointmentTime,
      Phonenumber,
      email
    })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'User Updated',
          text: 'The user has been updated successfully!',
        }).then(() => {
          navigate("/users");
        });
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating the appointment.',
        });
        console.log(err);
      });
  };

  const handleServiceTypeChange = (service) => {
    setServiceType(prevTypes =>
      prevTypes.includes(service)
        ? prevTypes.filter(type => type !== service)
        : [...prevTypes, service]
    );
  };

  const renderAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      times.push(time);
    }
    return times.map(time => (
      <option key={time} value={time} disabled={bookedTimes.includes(time)}>
        {time}
      </option>
    ));
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center">
      <div className="create-user-container">
        <div className="create-user-card">
          <form onSubmit={handleSubmit}>
            <h2 className="text-center mb-4 appointment-heading">Update Appointment</h2>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div className="mb-3">
              <label htmlFor="customerName" className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="vehicleModel" className="form-label">Vehicle Model</label>
              <select
                className="form-select"
                id="vehicleModel"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
              >
                <option value="">Select Vehicle Model</option>
                {vehicleModels.map((model, index) => (
                  <option key={index} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="serviceType" className="form-label">Service Type</label>
              <div className="service-types">
                {["Full Service", "Bodywash", "Oil Change", "Engine Check"].map((service) => (
                  <label key={service} className="form-check-label">
                    <input
                      type="checkbox"
                      checked={serviceType.includes(service)}
                      onChange={() => handleServiceTypeChange(service)}
                      className="form-check-input"
                    /> {service}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="appointmentDate" className="form-label">Appointment Date</label>
              <input
                type="date"
                className="form-control"
                id="appointmentDate"
                value={appointmentDate}
                onChange={(e) => {
                  setAppointmentDate(e.target.value);
                  fetchBookedTimes(e.target.value, serviceType);
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="appointmentTime" className="form-label">Appointment Time</label>
              <select
                className="form-control"
                id="appointmentTime"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              >
                <option value="">Select Time</option>
                {renderAvailableTimes()}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="Phonenumber" className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="Phonenumber"
                value={Phonenumber}
                onChange={(e) => setPhonenumber(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="text-center">
            <button type="submit" className="btn btn-success mb-2">Update User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Updateappointment;
