import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

function Users() {
    const [Users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001')
            .then(result => setUsers(result.data))  
            .catch(err => console.log(err));
    }, []);

    //update users button notify 
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
                // Navigate to update page if confirmed
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

    //want to added for delete button notifications
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!'
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
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>NIC</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Users.map((user) => {
                            return (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.date}</td>
                                    <td>{user.nic}</td>
                                    <td>{user.contact}</td>
                                    <td>{user.email}</td>
                                    <td>{user.position}</td>
                                    <td>
                                    <button className="btn btn-sm btn-primary" onClick={() => handleUpdate(user._id)}>Update</button> &nbsp;
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;
