import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { FaUser, FaCalendarAlt, FaPhone, FaEnvelope, FaBriefcase, FaIdCard, FaSun, FaMoon, FaUserPlus, FaTachometerAlt } from 'react-icons/fa';
import { AiOutlineLoading } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [openUserId, setOpenUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3001')
            .then(result => {
                setUsers(result.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
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
                axios.delete(`http://localhost:3001/deleteUser/${id}`)
                    .then(res => {
                        setUsers(users.filter(user => user._id !== id));
                        toast.success('User has been deleted!');
                    })
                    .catch(err => console.log(err));
            }
        });
    };

    const toggleUser = (id) => {
        setOpenUserId(openUserId === id ? null : id);
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className={`background d-flex vh-100 justify-content-center align-items-center ${darkMode ? 'dark' : ''}`}>
            <div className="w-75 bg-white rounded p-3">
                <div className="d-flex justify-content-between mb-3">
                    <Link to="/create" className='btn btn-success creative-btn btn-wide'>
                        <FaUserPlus className="me-2" /> ADD +
                    </Link>
                    <Link to="/dashboard" className='btn btn-primary creative-btn btn-wide'>
                        <FaTachometerAlt className="me-2" /> Dashboard
                    </Link>
                    <button onClick={toggleTheme} className="btn btn-secondary creative-btn btn-wide">
                        {darkMode ? <FaSun /> : <FaMoon />}
                    </button>
                </div>

                <br/>

                <input
                    type="text"
                    placeholder="Search users..."
                    className="form-control mb-3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {loading ? (
                    <div className="d-flex justify-content-center">
                        <AiOutlineLoading className="spinner" />
                    </div>
                ) : (
                    <div className="list-group">
                        {currentUsers.length > 0 ? currentUsers.map((user) => (
                            <div key={user._id} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-1" onClick={() => toggleUser(user._id)} style={{ cursor: 'pointer' }}>
                                        <FaUser className="me-2" /> {user.name}
                                    </h5>
                                    <div>
                                        <button className="btn btn-sm btn-primary me-2" onClick={(e) => { e.stopPropagation(); handleUpdate(user._id); }}>Update</button>
                                        <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }}>Delete</button>
                                    </div>
                                </div>
                                {openUserId === user._id && (
                                    <div className="mt-2 animated user-details"> {/* Add user-details class here */}
                                        <p><FaCalendarAlt className="me-2" /> <strong>Date:</strong> {user.date}</p>
                                        <p><FaIdCard className="me-2" /> <strong>NIC:</strong> {user.nic}</p>
                                        <p><FaPhone className="me-2" /> <strong>Contact:</strong> {user.contact}</p>
                                        <p><FaEnvelope className="me-2" /> <strong>Email:</strong> {user.email}</p>
                                        <p><FaBriefcase className="me-2" /> <strong>Position:</strong> {user.position}</p>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <p className="text-center">No users found.</p>
                        )}
                    </div>
                )}

                {/* Internal CSS */}
                <style>{`
                    .user-details {
                        background-color: #ed5959; /* Red background for user details */
                        color: white; /* Change text color to white for contrast */
                        padding: 10px; /* Optional: add some padding */
                        border-radius: 5px; /* Optional: round the corners */
                    }
                    .btn-wide {
                        width: 150px; /* Set a fixed width for all buttons */
                    }
                    .creative-btn {
                        background-color: #8B0000; /* Set button background color to #8B0000 */
                        color: white; /* Keep text color white for contrast */
                        position: relative;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 25px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                        transition: transform 0.3s, box-shadow 0.3s;
                    }

                    .creative-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
                    }

                    .creative-btn .fa {
                        font-size: 1.2rem;
                    }
                    .list-group-item {
                        transition: background-color 0.3s, transform 0.2s;
                        cursor: pointer;
                    }
                    .list-group-item:hover {
                        background-color: #f8f9fa;
                        transform: scale(1.02);
                    }
                    .list-group-item h5 {
                        margin: 0;
                    }
                    .spinner {
                        font-size: 2rem;
                        animation: spin 1s infinite linear;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .animated {
                        transition: all 0.3s ease;
                        max-height: 200px;
                        overflow: hidden;
                    }
                    .background {
                        background: url('https://www.transparenttextures.com/patterns/pattern.png');
                        position: relative;
                        overflow: hidden;
                    }
                    .dark {
                        background-color: #343a40;
                        color: white;
                    }
                    .dark .bg-white {
                        background-color: #495057;
                    }
                    .dark .btn-light {
                        background-color: #6c757d;
                        color: white;
                    }
                    .pagination {
                        display: flex;
                        justify-content: center;
                    }
                `}</style>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Users;
