import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from 'axios'
import backgroundImage from './assets/Carwash-Prague-czech-adriatech-13.jpg';


function UpdateService () {
  const {id} = useParams()
  const [service, setService] = useState()
  const [date, setDate] = useState()
  const [vin, setVin] = useState()
  const [price, setPrice] = useState()
  const [parts, setParts] = useState()
  const [notes, setNotes] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get('http://localhost:3001/getService/'+id)
      .then((result) => {console.log(result)
        setService(result.data.service)
        setDate(result.data.date)
        setVin(result.data.vin)
        setPrice(result.data.price)
        setParts(result.data.parts)
        setNotes(result.data.notes)
      })
      .catch((err) => console.log(err));
  }, []);

  const Update = (e) => {
    e.preventDefault();
    axios.put("http://localhost:3001/updateService/"+id,{service,date, vin, price, parts, notes})
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
          <form onSubmit={Update}>
            <h2>Update Services</h2>
            <div className="mb-3">
              <label htmlFor="service" className="form-label">Service</label>
              <input
                type="text"
                className="form-control"
                id="service"
                placeholder="Service Type"
                autoComplete='off'
                value={service}
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
                value={date}
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
                value={vin}
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
                value={price}
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
                value={parts}
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <br></br>
            <div align="right">
            <button type="submit" className="btn btn-sm btn-success w-50">Update</button>
            </div>
          </form>
        </div>
      </div>
    )
}

export default UpdateService;