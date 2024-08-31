import React from "react";

function UpdateUser () {
    return(
    
        <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
        <div className="card p-4 shadow" style={{ width: '400px', borderRadius: '20px' }}>
          <form>
          <h2>Update Employee</h2>
          <div className="mb-3">
              <label htmlFor="user" className="form-label"> Name</label>
              <input
                type="text"
                className="form-control"
                id="Name"
                placeholder="Enter Name"
                autoComplete='off'
              />
            </div>

            <div className="mb-3">
              <label htmlFor="user" className="form-label">Date Of Birth</label>
              <input
                type="text"
                className="form-control"
                id="Date"
                placeholder="Enter Date Of Birth"
                autoComplete='off'
              />
            </div>

            <div className="mb-3">
              <label htmlFor="user" className="form-label">NIC</label>
              <input
                type="text"
                className="form-control"
                id="NIC"
                placeholder="Enter NIC"
                autoComplete='off'
              />
            </div>

            <div className="mb-3">
              <label htmlFor="user" className="form-label">Contact</label>
              <input
                type="text"
                className="form-control"
                id="Contact"
                placeholder="Enter Contact Number"
                autoComplete='off'
              />
            </div>

            <div className="mb-3">
              <label htmlFor="user" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter Email"
                autoComplete='off'
              />
            </div>

            <div className="mb-3">
              <label htmlFor="user" className="form-label">Position</label>
              <input
                type="text"
                className="form-control"
                id="Position"
                placeholder="Enter Your Position"
                autoComplete='off'
              />
            </div>
            <button type="submit" className="btn btn-success w-100">Update</button>
          </form>
        </div>
      </div>
    )
}

export default UpdateUser;