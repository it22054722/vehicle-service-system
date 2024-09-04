import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'

function UpdateUser () {
  const {id} = useParams()
  const[name, setName] = useState()
  const[date, setDate] = useState()
  const[nic, setNIC] = useState()
  const[contact, setContact] = useState()
  const[email, setEmail] = useState()
  const[position, setPosition] = useState()
  const navigate = useNavigate()

  useEffect(()=> {
    axios.get('http://localhost:3001/getUser/'+id)
    .then(result =>{ console.log(result)
      setName(result.data.name)
      setDate(result.data.date)
      setNIC(result.data.nic)
      setContact(result.data.contact)
      setEmail(result.data.email)
      setPosition(result.data.position)
      
    })
    .catch(err => console.log(err))

  },[])

  const Update = (e) => {
    e.preventDefault();
    axios.put("http://localhost:3001/updateUser/"+id, {name, date, nic, contact, email, position})
    .then(result => {

      console.log(result)
      navigate('/')
    })
    .catch(err => console.log(err))
    
  }


    return(
    
        <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
        <div className="card p-4 shadow" style={{ width: '400px', borderRadius: '20px' }}>
          <form onSubmit={Update}>
          <h2>Update Employee</h2>
          <div className="mb-3">
              <label htmlFor="user" className="form-label"> Name</label>
              <input
                type="text"
                className="form-control"
                id="Name"
                placeholder="Enter Name"
                autoComplete='off'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="user" className="form-label">Date Of Birth</label>
              <input
                type="text"
                className="form-control"
                id="Date"
                placeholder="Enter Date Of Birth"
                autoComplete='off'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="user" className="form-label">NIC</label>
              <input
                type="text"
                className="form-control"
                id="NIC"
                placeholder="Enter NIC"
                autoComplete='off'
                value={nic}
                onChange={(e) => setNIC(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="user" className="form-label">Contact</label>
              <input
                type="text"
                className="form-control"
                id="Contact"
                placeholder="Enter Contact Number"
                autoComplete='off'
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="user" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter Email"
                autoComplete='off'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="user" className="form-label">Position</label>
              <input
                type="text"
                className="form-control"
                id="Position"
                placeholder="Enter Your Position"
                autoComplete='off'
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success w-100">Update</button>
          </form>
        </div>
      </div>
    )
}

export default UpdateUser;