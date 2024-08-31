import React from "react";


function UpdateService () {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
        <div className="card p-4 shadow" style={{ width: '475px', borderRadius: '20px' }}>
          <form>
            <h2>Update Services</h2>
            <div className="mb-3">
              <label htmlFor="service" className="form-label">Service</label>
              <input
                type="text"
                className="form-control"
                id="service"
                placeholder="Service Type"
                autoComplete='off'
              />
            </div>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                type="text"
                className="form-control"
                id="date"
                placeholder="Select Date"
                autoComplete='off'
              />
            </div>
  
            <div className="mb-3">
              <label htmlFor="vin" className="form-label">Vehicle Number</label>
              <input
                type="text"
                className="form-control"
                id="vin"
                placeholder="Enter the Number of the vehicle"
                autoComplete='off'
              />
            </div>
  
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="text"
                className="form-control"
                id="price"
                placeholder="Price issued in invoice"
                autoComplete='off'
              />
            </div>
  
            <div className="mb-3">
              <label htmlFor="parts" className="form-label">Part Used</label>
              <input
                type="text"
                className="form-control"
                id="parts"
                placeholder="Add the parts usage of the inventory."
                autoComplete='off'
              />
            </div>
  
            <div className="mb-3">
              <label htmlFor="notes" className="form-label">Technician's Note</label>
              <input
                type="text"
                className="form-control"
                id="notes"
                placeholder="The technician's opinion"
                autoComplete='off'
              />
            </div>
            <br></br>
            <div align="right">
            <button type="submit" className="btn btn-sm btn-success w-50">Update</button>
            </div>
          </form>
        </div>
      </div>
    )
}

export default UpdateService;