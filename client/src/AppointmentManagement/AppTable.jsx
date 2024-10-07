import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../app.css'; // Ensure this file includes the styles below
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from 'sweetalert2'; // Import SweetAlert2

function AppTable() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/appointments")
      .then(result => {
        setUsers(result.data);
        checkForReminders(result.data); // Check for reminders on load (Assuming you have a function for this)
      })
      .catch(err => console.log(err));
  }, []);

  const deleteUser = (id) => {
    const userExists = users.some(user => user._id === id);
    if (!userExists) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'User does not exist!',
      });
      return;
    }

    // SweetAlert confirmation before deleting
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/Deleteappointments/${id}`)
          .then(response => {
            setUsers(users.filter(user => user._id !== id));
            Swal.fire(
              'Deleted!',
              'User has been deleted successfully.',
              'success'
            );
          })
          .catch(err => {
            if (err.response && err.response.data && err.response.data.message) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response.data.message,
              });
            } else {
              console.error("Error deleting user:", err);
            }
          });
      }
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateReport = () => {
    const doc = new jsPDF();
    doc.text("Vehicle Service Management Report", 20, 10);
    autoTable(doc, {
      head: [['Customer Name', 'Vehicle Model', 'Service Type', 'Appointment Date', 'Appointment Time', 'Phone Number', 'Email']],
      body: filteredUsers.map(user => [
        user.customerName,
        user.vehicleModel,
        Array.isArray(user.serviceType) ? user.serviceType.join(", ") : user.serviceType,
        user.appointmentDate,
        user.appointmentTime,
        user.Phonenumber,
        user.email
      ]),
    });
    doc.save("Vehicle_Service_Report.pdf");
  };

  const handleSendReport = () => {
    const Phonenumber = "Phonenumber"; // Example phone number
    const message = 'Select the appointment details';
    const whatsappURl = `https://web.whatsapp.com/send?phone=${Phonenumber}&text=${encodeURIComponent(message)}`;

    // Open the WhatsApp chat in a new window
    window.open(whatsappURl, "_blank");
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center">
      <div className="container p-4 bg-white rounded shadow">
      <Link 
  to="/Createappointment" 
  className='btn mb-2' 
  style={{ backgroundColor: '#808080', color: 'white', border: 'none' }}>
  Create Appointment
</Link>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by Customer Name or Vehicle Model"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button 
  className="btn mb-3" 
  style={{ backgroundColor: '#8B0000', color: 'white', border: 'none' }} 
  onClick={generateReport}
>
  Download Report
</button>

        
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Vehicle Model</th>
                <th>Service Type</th>
                <th>Appointment Date</th>
                <th>Appointment Time</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.customerName}</td>
                  <td>{user.vehicleModel}</td>
                  <td>{Array.isArray(user.serviceType) ? user.serviceType.join(", ") : user.serviceType}</td>
                  <td>{user.appointmentDate}</td>
                  <td>{user.appointmentTime}</td>
                  <td>{user.Phonenumber}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="btn-group" role="group">
                    <Link 
  to={`/Updateappointment/${user._id}`} 
  className="btn mb-2" 
  style={{ backgroundColor: '#808080', color: 'white', border: 'none' }}>
  Update
</Link>

<button 
  onClick={() => deleteUser(user._id)} 
  className="btn btn-sm" 
  style={{ backgroundColor: '#8B0000', color: 'white', border: 'none' }}
>
  Delete
</button>

                    </div>
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

export default AppTable;
