import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QRCode } from 'react-qr-code';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import backgroundImage from './assets/supercars.png';
import Swal from 'sweetalert2';
import './QRCodePage.css'; // Import a new CSS file for styles

function QRCodePage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/Services") // Adjust the URL as needed
      .then((result) => {
        setServices(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFilter = () => {
    const filtered = services.filter(service => service.vin === vehicleNumber);
    setFilteredServices(filtered);
  };

  const downloadPDF = () => {
    const input = document.getElementById('qr-codes-container');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190; // Set appropriate width
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('qr-codes.pdf');

      Swal.fire({
        icon: 'success',
        title: 'Successful!',
        text: 'PDF downloaded successfully.',
        confirmButtonColor: '#b3202e',
        background: '#fff',
        color: '#333',
      });
    });
  };

  return (
    <div className="qr-code-page">
      <h2 className="title">Generate QR Codes</h2>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          className="vehicle-input"
        />
        <button 
          onClick={handleFilter} 
          className="find-button"
        >
          Find
        </button>
      </div>

      {vehicleNumber && (
        <div id="qr-codes-container" className="qr-codes">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <div key={index} className="qr-code-card">
                <h3 className="qr-title">QR Code for VIN: {service.vin}</h3>
                <QRCode value={`http://localhost:3001/service/${service.vin}`} size={128} />
              </div>
            ))
          ) : (
            <p className="no-results">No records found for this vehicle number.</p>
          )}
        </div>
      )}

      <div className="button-container">
        <button
          onClick={downloadPDF} 
          className="pdf-button"
        >
          Download PDF
        </button>

        <button
          className="nav-button"
          onClick={() => navigate('/Servicereports')}
        >
          View Reports
        </button>

        <button
          className="nav-button"
          onClick={() => navigate('/serviceDashboard')}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default QRCodePage;
