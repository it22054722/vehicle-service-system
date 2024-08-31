import React from "react";

function UpdateTrainee (){
   return( 
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
    <div className="card p-4 shadow" style={{ width: '400px', borderRadius: '20px' }}>
      <form>
        
<h2>Update Trainee</h2>
        <div className="mb-3">
          <label htmlFor="Trainee_id" className="form-label">Trainee ID</label>
          <input
            type="text"
            className="form-control"
            id="Trainee_id"
            placeholder="Enter ID"
            autoComplete='off'
          />
        </div>

        <div className="mb-3">
          <label htmlFor="Name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="Name"
            placeholder="Enter Name"
            autoComplete='off'
          />
        </div>

        <div className="mb-3">
          <label htmlFor="Age" className="form-label">Age</label>
          <input
            type="text"
            className="form-control"
            id="Age"
            placeholder="Enter Age"
            autoComplete='off'
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Trainee_Periode" className="form-label">Trainee Periode</label>
          <input
            type="text"
            className="form-control"
            id="Trainee_Periode"
            placeholder="Enter periode"
            autoComplete='off'
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter Email"
            autoComplete='off'
          />
        </div>

        <div className="mb-3">
          <label htmlFor="Phone" className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            id="Phone"
            placeholder="Enter Phone number"
            autoComplete='off'
          />
        </div >
      <div align="center">
        <button type="update" className="btn btn-sm btn-success w-20">Update</button>
        
        </div>
      </form>
    </div>
  </div>
   )
}

export default UpdateTrainee;