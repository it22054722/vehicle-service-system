import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
//import '../Pages/styles/ViewPackage.css'; // Import custom CSS for consistent styling

const ViewPackage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [pkg, setPkg] = useState(null);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/package/get/${id}`);
        setPkg(response.data.pkg);
      } catch (error) {
        console.error('Error fetching package:', error);
        setError('Failed to load package details. Please try again later.'); // Set error message
      }
    };

    fetchPackage();
  }, [id]);

  if (error) {
    return (
      <div className="text-center mt-5">
        <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '2rem' }}></i>
        <p>{error}</p>
      </div>
    ); // Show error state if there is an error
  }

  if (!pkg) {
    return (
      <div className="text-center mt-5">
        <i className="bi bi-spinner text-primary" style={{ fontSize: '2rem' }}></i>
        <p>Loading...</p>
      </div>
    ); // Show loading state if the package is not loaded yet
  }

  return (
    <div className="d-flex align-items-center justify-content-center" 
    style={{ height: 'calc(100vh + 20px)', marginTop: '90px', overflow: 'hidden' }}>
   {/* Your content goes here */}

      <div className="row w-100">
        <div className="col-md-8 col-lg-6 mx-auto"> {/* Adjust width */}
          <div className="card shadow rounded-4 bg-light bg-opacity-50"> {/* Increased transparency */}
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4 position-relative" style={{ fontSize: "2rem", color: "#333" }}>
                <i className="bi bi-eye me-2"></i>View Package
                <div className="title-underline"></div>
              </h2>

              <div className="list-group">
                <div className="list-group-item d-flex align-items-center">
                  <i className="bi bi-tag text-info me-3" style={{ fontSize: '1.75rem' }}></i>
                  <strong>Package Name:</strong> {pkg.packageName}
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <i className="bi bi-cash text-success me-3" style={{ fontSize: '1.75rem' }}></i>
                  <strong>Price:</strong> ${pkg.price.toFixed(2)}
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <i className="bi bi-tag text-info me-3" style={{ fontSize: '1.75rem' }}></i>
                  <strong>Category:</strong> {pkg.category}
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <i className="bi bi-percent text-danger me-3" style={{ fontSize: '1.75rem' }}></i>
                  <strong>Discount:</strong> {pkg.discount}%
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <i className="bi bi-file-text text-primary me-3" style={{ fontSize: '1.75rem' }}></i>
                  <strong>Description:</strong> {pkg.description}
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <i className={`bi ${pkg.availability ? 'bi-check-circle text-success' : 'bi-x-circle text-danger'} me-3`} style={{ fontSize: '1.75rem' }}></i>
                  <strong>Availability:</strong> {pkg.availability ? 'Available' : 'Not Available'}
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <i className="bi bi-hourglass-split text-warning me-3" style={{ fontSize: '1.75rem' }}></i>
                  <strong>Duration:</strong> {pkg.duration} hours
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <i className="bi bi-person-plus text-secondary me-3" style={{ fontSize: '1.75rem' }}></i>
                  <strong>Max Customers:</strong> {pkg.maxCustomers}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPackage;
