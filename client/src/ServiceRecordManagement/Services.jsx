import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate for navigation
import { FaEdit } from 'react-icons/fa'; 
import { MdDelete } from 'react-icons/md'; 
import { FiLogOut } from 'react-icons/fi';  // Import logout icon
import backgroundImage from './assets/supercars.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Services() {
  const [Services, setServices] = useState([]);
  const navigate = useNavigate();  // Initialize useNavigate for redirection

  useEffect(() => {
    axios
      .get("http://localhost:3001/Services")
      .then((result) => setServices(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('http://localhost:3001/deleteService/' + id)
          .then((res) => {
            toast.success("Service record deleted successfully!");
            setServices((prevServices) => prevServices.filter(service => service._id !== id));
          })
          .catch((err) => {
            toast.error("Failed to delete the service record.");
          });

        MySwal.fire('Deleted!', 'Your service record has been deleted.', 'success');
      }
    });
  };

  // Handle Logout Click
  const handleLogout = () => {
    navigate("/");  
    toast.info("Logged out successfully!");  
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
      <div className="w-90 rounded p-4 shadow" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#b3202e', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>Services</h2>
        <h4 style={{ textAlign: 'left', marginBottom: '0.2rem', color: '#b3202e', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>Our Assets..</h4>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div>
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
          {/* Logout Icon */}
          <button onClick={handleLogout} className="btn mx-1">
            <FiLogOut style={{ fontSize: '1.5rem', color: '#a1192d', cursor: 'pointer' }} title="Logout" />
          </button>
        </div>

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
      <ToastContainer />
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
  fontSize: '1.5rem',
  cursor: 'pointer',
};

export default Services;
