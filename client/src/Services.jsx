import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import backgroundImage from './assets/Carwash-Prague-czech-adriatech-14.jpg'; // Adjust the path as necessary

function Services() {
  const [Services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then((result) => setServices(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete =(id) => {
    axios.delete('http://localhost:3001/deleteService/'+id)
    .then(res => {console.log(res)
      window.location.reload()})
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
      <div className="w-75 bg-white rounded p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Link to="/create" className="btn btn-sm btn-success">
          Add +
        </Link>
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
            {Services.map((service, index) => (
              <tr key={index}>
                <td>{service.service}</td>
                <td>{service.date}</td>
                <td>{service.vin}</td>
                <td>{service.price}</td>
                <td>{service.parts}</td>
                <td>{service.notes}</td>
                <td>
                  <Link to={`/update/${service._id}`} className="btn btn-sm btn-primary">
                    Edit
                  </Link>
                  &nbsp;&nbsp;
                  <button className="btn btn-sm btn-danger" 
                  onClick={(e) => handleDelete(service._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Services;
