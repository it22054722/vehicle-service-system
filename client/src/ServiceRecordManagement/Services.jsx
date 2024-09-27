import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit } from 'react-icons/fa'; // Import the edit icon from react-icons
import { MdDelete } from 'react-icons/md'; // Import a new delete icon from react-icons
import backgroundImage from './assets/supercars.png';

function Services() {
  const [Services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/Services")
      .then((result) => setServices(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete('http://localhost:3001/deleteService/' + id)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
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
      <div className="w-90 rounded p-4 shadow" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)"}}>
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#b3202e', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>Services</h2>
      <h4 style={{ textAlign: 'left', marginBottom: '0.2rem', color: '#b3202e', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>Our Assetes..</h4>
        <div className="mb-3">
          <Link to="/servicecreate" className="btn btn-success mx-1" style={{ borderRadius: '0.3rem', marginLeft: '10px', width: '100px', backgroundColor: '#b3202e', borderColor: '#b3202e' }}>
            Add +
          </Link>
          <Link to="/Servicereports" className="btn btn-success mx-1" style={{ borderRadius: '0.3rem', marginLeft: '10px', width: '100px', backgroundColor: '#b3202e', borderColor: '#b3202e' }}>
            Reports
          </Link>
          <Link to="/serviceDashboard" className="btn btn-danger mx-1" style={{ borderRadius: '0.3rem', marginLeft: '10px', width: '100px', backgroundColor: '#b3202e', borderColor: '#b3202e' }}>
            Dashboard
          </Link>
        </div>
        
        {/* Scrollable table container */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-hover table-striped" style={tableStyle}>
            <thead>
              <tr style={headerStyle}>
                <th>Service</th>
                <th>Date</th>
                <th>Vehicle Number</th>
                <th>Price</th>
                <th>Parts Used</th>
                <th>Quantity</th>
                <th>Technician Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Services.map((service, index) => (
                <tr key={index} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                  <td>{service.service}</td>
                  <td>{service.date}</td>
                  <td>{service.vin}</td>
                  <td>{service.price}</td>
                  <td>{service.parts}</td>
                  <td>{service.quantity}</td>
                  <td>{service.notes}</td>
                  <td>
                    <Link to={`/serviceupdate/${service._id}`} className="btn mx-1">
                      <FaEdit style={{ ...iconStyle, color: '#a1192d' }} title="Edit" />
                    </Link>
                    <button className="btn mx-1" onClick={() => handleDelete(service._id)}>
                      <MdDelete style={{ ...iconStyle, color: '#a1192d' }} title="Delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
};

const headerStyle = {
  backgroundColor: '#a1192d',
  color: 'white',
  textAlign: 'center',
};

const rowEvenStyle = {
  backgroundColor: '#f9f9f9',
};

const rowOddStyle = {
  backgroundColor: '#fff',
};

const iconStyle = {
  fontSize: '1.5rem', // Adjust the icon size
  cursor: 'pointer', // Make the icon clickable
};

export default Services;
