import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Trainees (){
   const [Trainees, setTrainee] = useState([])

useEffect(() =>{
  axios.get('http://localhost:3001')
  .then(result =>setTrainee(result.data))
  .catch(err => console.log(err))

},[]);

    return(
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
        <div className="w-75 bg-white rounded p-3">
           <Link to="/create" className='btn btn-sm btn-success'>Add +</Link>
           

          <table className="table">
            <thead>
              <tr>
            
                <th>Trainee ID</th>
                <th>Trainee Name</th>
                <th>Age</th>
                <th>Trainee Periode</th>
                <th>  Email  </th>
                <th>Phone number</th>
                <th>Action</th>
                
              </tr>
            </thead>
            <tbody>
              {
                  Trainees.map((Trainee)=>{
                     return <tr>
                      <td>{Trainee.trainee_id}</td>
                      <td>{Trainee.name}</td>
                      <td>{Trainee.age}</td>
                      <td>{Trainee.trainee_periode}</td>
                      <td>{Trainee.email}</td>
                      <td>{Trainee.phone_number}</td>
                      <td>
                      <Link to={`/update/${Trainee._id}`} className='btn btn-sm btn-success'>Edit</Link>&nbsp;&nbsp;
                        
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

export default Trainees;