import React from 'react';
import { Link } from 'react-router-dom';
import './servicedetails.css'; // Import the CSS file

const Servicedetails = () => {
  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center"> {/* Apply the background */}
      <div className="container service-details-container py-5">
        <h2 className="text-center mb-4">Service Type Details</h2>
        <p>We offer a wide range of services to keep your vehicle in top condition. Choose from the options below:</p>

        <ul className="list-group mb-4">
          <li className="list-group-item">
            <h5>Full Service</h5>
            <p>Comprehensive maintenance package covering all essential checks and servicing for your vehicle. Cost: $100</p>
          </li>
          <li className="list-group-item">
            <h5>Bodywash</h5>
            <p>External wash to keep your car looking shiny and new. Cost: $50</p>
          </li>
          <li className="list-group-item">
            <h5>Oil Change</h5>
            <p>Regular oil changes to keep your engine running smoothly. Cost: $70</p>
          </li>
          <li className="list-group-item">
            <h5>Engine Check</h5>
            <p>Thorough engine diagnostics and performance checks to ensure safety and reliability. Cost: $120</p>
          </li>
          <li className="list-group-item">
            <h5>Hybrid Service</h5>
            <p>Specialized service for hybrid vehicles, including both electric and gas components. Cost: $150</p>
          </li>
          <li className="list-group-item">
            <h5>Wheel Alignment</h5>
            <p>Ensures that your wheels are properly aligned to improve driving stability and extend tire life. Cost: $80</p>
          </li>
          <li className="list-group-item">
            <h5>Battery Services</h5>
            <p>Inspection, maintenance, and replacement of vehicle batteries. Cost: $60</p>
          </li>
          <li className="list-group-item">
            <h5>Part Replacements</h5>
            <p>Replacement of essential vehicle parts to ensure optimum performance. Cost: $200</p>
          </li>
          <li className="list-group-item">
            <h5>Engine Tune Ups</h5>
            <p>Comprehensive engine tune-ups to improve performance and efficiency. Cost: $250</p>
          </li>
          <li className="list-group-item">
            <h5>Other</h5>
            <p>Other custom services based on your vehicle's needs. Cost: Varies</p>
          </li>
        </ul>

        <div className="text-center">
          <Link to="/Createappointment" className="btn btn-primary">
            Create Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Servicedetails;
