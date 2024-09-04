import React, { useState } from "react";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import backgroundImage from './assets/Carwash-Prague-czech-adriatech-13.jpg';

function CreateService () {
  const [service, setService] = useState()
  const [date, setDate] = useState()
  const [vin, setVin] = useState()
  const [price, setPrice] = useState()
  const [parts, setParts] = useState()
  const [notes, setNotes] = useState()
  const navigate = useNavigate()

  const Submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/createService",{service,date, vin, price, parts, notes})
    .then(result => { 
     console.log(result)
     navigate('/')
  })
    .catch(err => console.log(err))
  }

    return (
      <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card p-4 shadow" style={{ width: '475px', borderRadius: '20px' }}>
        <form onSubmit={Submit}>
          <h2>Add Services</h2>
          <div className="mb-3">
            <label htmlFor="service" className="form-label">Service</label>
            <input
              type="text"
              className="form-control"
              id="service"
              placeholder="Service Type"
              autoComplete='off'
              onChange={(e) => setService(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="text"
              className="form-control"
              id="date"
              placeholder="Select Date"
              autoComplete='off'
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="vin" className="form-label">Vehicle Number</label>
            <input
              type="text"
              className="form-control"
              id="vin"
              placeholder="Enter the Number of the vehicle"
              autoComplete='off'
              onChange={(e) => setVin(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              type="text"
              className="form-control"
              id="price"
              placeholder="Price issued in invoice"
              autoComplete='off'
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="parts" className="form-label">Part Used</label>
            <input
              type="text"
              className="form-control"
              id="parts"
              placeholder="Add the parts usage of the inventory."
              autoComplete='off'
              onChange={(e) => setParts(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="notes" className="form-label">Technician's Note</label>
            <input
              type="text"
              className="form-control"
              id="notes"
              placeholder="The technician's opinion"
              autoComplete='off'
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <br></br>
          <div align="right">
          <button type="submit" className="btn btn-sm btn-success w-50">Submit</button>
          </div>
        </form>
      </div>
    </div>
    )
}

export default CreateService;