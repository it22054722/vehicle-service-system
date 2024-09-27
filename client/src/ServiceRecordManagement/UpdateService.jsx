import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import backgroundImage from './assets/supercars.png';
import { Link } from "react-router-dom";

function UpdateService() {
  const { id } = useParams();
  const [service, setService] = useState('');
  const [date, setDate] = useState(new Date());
  const [vin, setVin] = useState('');
  const [price, setPrice] = useState('');
  const [parts, setParts] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/getService/${id}`)
      .then(response => {
        const serviceData = response.data;
        setService(serviceData.service);
        setDate(new Date(serviceData.date));
        setVin(serviceData.vin);
        setPrice(serviceData.price);
        setParts(serviceData.parts);
        setQuantity(serviceData.quantity);
        setNotes(serviceData.notes);
      })
      .catch(err => console.log(err));
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!service) newErrors.service = "Service is required.";
    if (!vin) newErrors.vin = "Vehicle Number is required.";
    if (!price) newErrors.price = "Price is required.";
    if (!parts) newErrors.parts = "Parts Used is required.";
    if (!notes) newErrors.notes = "Technician's Note is required.";
    return newErrors;
  };

  const Submit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }
    axios.put(`http://localhost:3001/updateService/${id}`, {
      service, 
      date: date.toISOString().split('T')[0],
      vin, 
      price, 
      parts, 
      quantity: Number(quantity),
      notes
    })
    .then(result => {
      console.log(result);
      navigate('/serviceRecords');
    })
    .catch(err => console.log(err));
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card p-4 shadow" style={{  width: '520px', borderRadius: '20px',backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
        <form onSubmit={Submit}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#b3202e', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>Service Records Section</h2>
          <h5 style={{ textAlign: 'left', marginBottom: '1rem', color: '#b3202e', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>Car’s Story Starts Here: Update Service Records!</h5>
          <br />
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="service" className="form-label">Service</label>
              <select
                className="form-select"
                id="service"
                value={service}
                onChange={(e) => { setService(e.target.value); setErrors({ ...errors, service: undefined }); }}
              >
                <option value="">Select Service</option>
                <option value="Change Oil">Change Oil</option>
                <option value="Full Interior Service">Full Interior Service</option>
                <option value="Full Exterior Service">Full Exterior Service</option>
                <option value="Wheel Alignment">Wheel Alignment</option>
                <option value="Fluid Checks and Replacement">Fluid Checks and Replacement</option>
                <option value="Battery Services">Battery Services</option>
                <option value="Transmission Services">Transmission Services</option>
                <option value="Exhaust System Repair">Exhaust System Repair</option>
                <option value="Air Conditioning/Heating Repair">Air Conditioning/Heating Repair</option>
                <option value="Pre-purchase Inspections">Pre-purchase Inspections</option>
                <option value="Hybrid/Electric Vehicle Services">Hybrid/Electric Vehicle Services</option>
              </select>
              {errors.service && <div className="text-danger">{errors.service}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="date" className="form-label">Date</label>
              <br />
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                id="date"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="vin" className="form-label">Vehicle Number</label>
              <input
                type="text"
                className="form-control"
                id="vin"
                placeholder="Enter the Number of the vehicle"
                autoComplete='off'
                value={vin}
                onChange={(e) => { setVin(e.target.value); setErrors({ ...errors, vin: undefined }); }}
              />
              {errors.vin && <div className="text-danger">{errors.vin}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="text"
                className="form-control"
                id="price"
                placeholder="Price issued in invoice"
                autoComplete='off'
                value={price}
                onChange={(e) => { setPrice(e.target.value); setErrors({ ...errors, price: undefined }); }}
              />
              {errors.price && <div className="text-danger">{errors.price}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="parts" className="form-label">Parts Used</label>
              <select
                className="form-select"
                id="parts"
                value={parts}
                onChange={(e) => { setParts(e.target.value); setErrors({ ...errors, parts: undefined }); }}
              >
                <option value="">Select Parts</option>
                <option value="Oil Filters">Oil Filters</option>
                <option value="Air Filters">Air Filters</option>
                <option value="Spark Plugs">Spark Plugs</option>
                <option value="Timing Belts/Chains">Timing Belts/Chains</option>
                <option value="Gaskets and Seals">Gaskets and Seals</option>
                <option value="Transmission Fluid">Transmission Fluid</option>
                <option value="Brake Pads">Brake Pads</option>
                <option value="Clutch Kits">Clutch Kits</option>
                <option value="Brake Rotors/Discs">Brake Rotors/Discs</option>
                <option value="Shocks and Struts">Shocks and Struts</option>
                <option value="Bushings">Bushings</option>
                <option value="Steering Rack and Pinion">Steering Rack and Pinion</option>
                <option value="Catalytic Converters">Catalytic Converters</option>
                <option value="Exhaust Pipes">Exhaust Pipes</option>
                <option value="Thermostats">Thermostats</option>
                <option value="Fuel Injectors">Fuel Injectors</option>
                <option value="Seats and Seat Belts">Seats and Seat Belts</option>
                <option value="Windshields and Windows">Windshields and Windows</option>
                <option value="Bumpers">Bumpers</option>
              </select>
              {errors.parts && <div className="text-danger">{errors.parts}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="quantity" className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                min="1"
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="notes" className="form-label">Technician's Note</label>
            <input
              type="text"
              className="form-control"
              id="notes"
              placeholder="The technician's opinion"
              autoComplete='off'
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setErrors({ ...errors, notes: undefined }); }}
            />
            {errors.notes && <div className="text-danger">{errors.notes}</div>}
          </div>
          <br />
          <div align="right">
          <Link to="/services" className="btn btn-success mx-1" style={{ borderRadius: '0.3rem', marginLeft: '10px', width: '100px', backgroundColor: '#b3202e', borderColor: '#b3202e' }}>
            Services
            </Link>
            <button type="submit" className="btn btn-success" style={{ borderRadius: '0.3rem', marginLeft: '10px', width: '100px', backgroundColor: '#b3202e', borderColor: '#b3202e' }}>Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateService;
