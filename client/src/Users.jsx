import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Users() {
    const [Users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001')
            .then(result => setUsers(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete('http://localhost:3001/deleteUser/' + id)
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

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
                                        <Link to={`/update/${user._id}`} className="btn btn-sm btn-primary">Update</Link> &nbsp;
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
