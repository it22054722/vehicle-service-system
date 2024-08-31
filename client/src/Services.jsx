import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function Services () {

    const [Services, setServices] = useState([])

    useEffect(() => {
      axios.get('http://localhost:3001')
      .then(result => setServices(result.data))
      .catch(err => console.log(err))
    },[])

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-75 bg-white rounded p-3">
       <Link to="/create" className='btn btn-sm btn-success'>Add +</Link> 
        <table className="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Date</th>
              <th>Vehicle&nbsp;Number</th>
              <th>Price</th>
              <th>Parts&nbsp;Used</th>
              <th>Technician&nbsp;notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
                Services.map((service)=>{
                    return <tr>
                    <td>{service.service}</td>
                    <td>{service.date}</td>
                    <td>{service.vin}</td>
                    <td>{service.price}</td>
                    <td>{service.parts}</td>
                    <td>{service.notes}</td>
                    <td>
                    <Link to="/update" className='btn btn-sm btn-primary'>Edit</Link>&nbsp;&nbsp;
                    <button className="btn btn-sm btn-danger">Delete</button>
                    </td>
                    </tr>
                })
            }
            
          </tbody>
        </table>
      </div>
    </div>
    )
}

export default Services;