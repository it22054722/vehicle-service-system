import React, { useState } from "react";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function CreateTrainee (){
     
  const[trainee_id, setID] = useState()
  const[name, setName] = useState()
  const[age, setAge] = useState()
  const[trainee_periode, setTperiode] = useState()
  const[email, setEmail] = useState()
  const[phone_number, setPnumber] = useState()
  const navigate = useNavigate()

  const Submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/createTrainee", {trainee_id,name,age,trainee_periode,email,phone_number})
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
          
        <h2>Add Trainee</h2>
          <div className="mb-3">
            <label htmlFor="trainee_id" className="form-label">Trainee ID</label>
            <input
              type="text"
              className="form-control"
              id="trainee_id"
              placeholder="Enter ID"
              autoComplete='off'
                
                onChange ={(e) => setID(e.target.value)}/>
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter Name"
              autoComplete='off'

              onChange ={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              type="text"
              className="form-control"
              id="age"
              placeholder="Enter Age"
              autoComplete='off'

              onChange ={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="trainee_periode" className="form-label">Trainee Periode</label>
            <input
              type="text"
              className="form-control"
              id="trainee_periode"
              placeholder="Enter periode"
              autoComplete='off'

              onChange ={(e) => setTperiode(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter Email"
              autoComplete='off'

              onChange ={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              id="phone_number"
              placeholder="Enter Phone number"
              autoComplete='off'

              onChange ={(e) => setPnumber(e.target.value)}
            />
          </div >
        <div align="center">
          <button type="submit" className="btn btn-sm btn-success w-20">Submit</button>
          
          </div>
        </form>
      </div>
    </div>
 
    )
}

export default CreateTrainee;