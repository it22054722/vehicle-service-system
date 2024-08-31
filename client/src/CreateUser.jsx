import React, { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom"

function CreateUser () {

  const[name, setName] = useState()
  const[date, setDate] = useState()
  const[nic, setNIC] = useState()
  const[contact, setContact] = useState()
  const[email, setEmail] = useState()
  const[position, setPosition] = useState()
  const navigate = useNavigate()

  const Submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/CreateUser", {name, date, nic, contact, email, position})
    .then(result => {

      console.log(result)
      navigate('/')
    })
    .catch(err => console.log(err))
  }

    return(
        <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
        <div className="card p-4 shadow" style={{ width: '400px', borderRadius: '20px' }}>

          <form onSubmit={Submit}>
          <h2>Create Employee</h2>

          <div className="mb-3">
              <label htmlFor="name" className="form-label"> Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter Name"
                autoComplete='off'
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date Of Birth</label>
              <input
                type="text"
                className="form-control"
                id="date"
                placeholder="Enter Date Of Birth"
                autoComplete='off'
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="nic" className="form-label">NIC</label>
              <input
                type="text"
                className="form-control"
                id="nic"
                placeholder="Enter NIC"
                autoComplete='off'
                onChange={(e) => setNIC(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="contact" className="form-label">Contact</label>
              <input
                type="text"
                className="form-control"
                id="contact"
                placeholder="Enter Contact Number"
                autoComplete='off'
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="Enter Email"
                autoComplete='off'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="position" className="form-label">Position</label>
              <input
                type="text"
                className="form-control"
                id="position"
                placeholder="Enter Your Position"
                autoComplete='off'
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success w-100">Submit</button>
          </form>
        </div>
      </div>
    )
}

export default CreateUser;