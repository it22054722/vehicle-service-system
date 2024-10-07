import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { FaUser, FaCalendarAlt, FaPhone, FaEnvelope, FaBriefcase, FaIdCard } from 'react-icons/fa';

function Users() {
    const [Users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001')
            .then(result => setUsers(result.data))  
            .catch(err => console.log(err));
    }, []);

    const handleUpdate = (id) => {
        Swal.fire({
            title: 'Proceed to update?',
            text: 'You are about to update user details.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, update!',
            cancelButtonText: 'No, cancel!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = `/update/${id}`;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'User update was cancelled.',
                    'error'
                );
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete('http://localhost:3001/deleteUser/' + id)
                    .then(res => {
                        console.log(res);
                        Swal.fire(
                            'Deleted!',
                            'User has been deleted.',
                            'success'
                        );
                        window.location.reload();
                    })
                    .catch(err => console.log(err));
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'User deletion was cancelled.',
                    'error'
                );
            }
        });
    };

    return (
        <div className="background d-flex vh-100 justify-content-center align-items-center">
            <div className="w-75 bg-white rounded p-3">
                <div className="d-flex justify-content-between mb-3">
                    <Link to="/create" className='btn btn-success'>ADD +</Link>
                    <Link to="/dashboard" className='btn btn-success'>Dashboard</Link>
                </div>
                
                {/* Scrollable container */}
                <div className="scrollable-container">
                    <div className="row">
                        {Users.map((user) => (
                            <div key={user._id} className="col-md-4 mb-4">
                                <div className="card user-card">
                                    <div className="card-body">
                                        <h5 className="card-title d-flex align-items-center">
                                            <FaUser className="me-2" /> {user.name}
                                        </h5>
                                        <p className="card-text"><FaCalendarAlt className="me-2" /> <strong>Date:</strong> {user.date}</p>
                                        <p className="card-text"><FaIdCard className="me-2" /> <strong>NIC:</strong> {user.nic}</p>
                                        <p className="card-text"><FaPhone className="me-2" /> <strong>Contact:</strong> {user.contact}</p>
                                        <p className="card-text"><FaEnvelope className="me-2" /> <strong>Email:</strong> {user.email}</p>
                                        <p className="card-text"><FaBriefcase className="me-2" /> <strong>Position:</strong> {user.position}</p>
                                        <div className="d-flex">
                                            <button className="btn btn-sm btn-primary me-2" onClick={() => handleUpdate(user._id)}>Update</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Internal CSS */}
                <style>{`
                    .scrollable-container {
                        max-height: 400px; /* Adjust as needed */
                        overflow-y: auto;
                        padding-right: 15px; /* For scrollbar visibility */
                        border-radius: 10px;
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(230, 230, 230, 0.8));
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        backdrop-filter: blur(10px);
                    }

                    .user-card {
                        position: relative;
                        background: #fff;
                        border: 1px solid #e0e0e0;
                        border-radius: 15px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                        transition: transform 0.3s, box-shadow 0.3s;
                    }

                    .user-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    }

                    .card-title {
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: #007bff;
                    }

                    .card-text {
                        font-size: 1.1rem;
                        margin: 0.5rem 0;
                        color: #333;
                    }

                    .card-body {
                        padding: 1.5rem;
                    }

                    .btn {
                        transition: background-color 0.3s;
                    }

                    .btn-primary:hover {
                        background-color: #0056b3;
                    }

                    .btn-danger:hover {
                        background-color: #c82333;
                    }

                    /* Adding an animated background */
                    .background {
                        background: url('https://www.transparenttextures.com/patterns/pattern.png');
                        position: relative;
                        overflow: hidden;
                    }
                `}</style>
            </div>
        </div>
    );
}

export default Users;
