import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Users () {
    const [Users, setUsers] = useState([])
        
    

    useEffect(()=> {
      axios.get('http://localhost:3001')
      .then(result => setUsers(result.data))
      .catch(err => console.log(err))

    },[])


    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <Link to="/create" className='btn btn-success'>ADD +</Link>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>NIC</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {
                Users.map((user)=>{
                    return <tr>
                    <td>{user.name}</td>
                    <td>{user.date}</td>
                    <td>{user.nic}</td>
                    <td>{user.contact}</td>
                    <td>{user.email}</td>
                    <td>{user.position}</td>
                    
                    <td><Link to="/update" className="btn btn-sm btn-primary">Update</Link> &nbsp;
                    <button className="btn btn-sm btn-danger">Delete</button></td>
                    </tr>
                })
            }
          </tbody>
        </table>
      </div>
    </div>
    
    )
}

export default Users;