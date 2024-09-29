import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useNavigate } from "react-router-dom";
import backgroundImage from './assets/supercars.png';
import Swal from 'sweetalert2';

function ServiceReports() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/Services")
      .then((result) => {
        setServices(result.data);
        setFilteredServices(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFilter = () => {
    let filtered = services;

    if (vehicleNumber) {
      filtered = filtered.filter(service => service.vin === vehicleNumber);
    }

    if (date) {
      filtered = filtered.filter(service => service.date === date);
    }

    setFilteredServices(filtered);
  };

  const generatePDFTable = () => {
    const doc = new jsPDF();
    doc.text("Service Reports", 20, 10);
    const tableColumn = ["Date", "Parts Used", "Quantity"];
    const tableRows = filteredServices.map((service) => [
      service.date,
      service.parts,
      service.quantity,
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("service_reports.pdf");

    Swal.fire({
      icon: 'success',
      title: 'Downloaded!',
      text: 'Service table PDF downloaded successfully.',
      confirmButtonColor: '#b3202e',
      background: '#fff',
      color: '#333',
    });
  };

  const generatePDFChart = () => {
    const doc = new jsPDF();
    doc.text("Service Count Chart", 20, 10);
    const chartCanvas = document.getElementById("serviceChart");
    const imgData = chartCanvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 15, 40, 180, 160);
    doc.save("service_chart.pdf");

    Swal.fire({
      icon: 'success',
      title: 'Downloaded!',
      text: 'Service table PDF downloaded successfully.',
      confirmButtonColor: '#b3202e',
      background: '#fff',
      color: '#333',
    });
  };

  const serviceCounts = filteredServices.reduce((acc, service) => {
    acc[service.service] = (acc[service.service] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(serviceCounts),
    datasets: [
      {
        label: "Service Count",
        data: Object.values(serviceCounts),
        backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
      title: {
        display: true,
        text: 'Service Counts by Type',
        font: { size: 18, family: "'Poppins', sans-serif", weight: 'bold' },
        color: '#333',
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#333' } },
      y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.1)' }, ticks: { color: '#333' } },
    },
  };

  // Function to generate email body
  const generateEmailBody = () => {
    if (filteredServices.length === 0) return '';

    const emailBody = filteredServices.map(service => 
      `Date: ${service.date}\nParts Used: ${service.parts}\nQuantity: ${service.quantity}`
    ).join('\n\n');

    return encodeURIComponent(emailBody);
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', minHeight: '110vh', padding: '2rem' }}>
      <div style={{ width: '80%', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '1rem', padding: '2rem', boxShadow: '0 8px 40px rgba(0, 0, 0, 0.3)', margin: '2rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#b3202e', fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>Service Reports</h2>
        <h5 style={{ textAlign: 'left', marginBottom: '1rem', color: '#333', fontFamily: "'Poppins', sans-serif" }}>A one tap makes things easy.</h5>
        
        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Enter Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc', width: '100%' }}
            />
          </div>
          <div className="col-md-6">
          <button className="btn btn-danger" onClick={handleFilter} style={{ borderRadius: '0.3rem', marginLeft: '10px', backgroundColor: '#b3202e', borderColor: '#b3202e', padding: '0.5rem 1rem' }}>
              Filter
            </button>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc', width: '100%' }}
            />
          </div>
          <div className="col-md-6">
          <button className="btn btn-danger " onClick={handleFilter} style={{ borderRadius: '0.3rem', marginLeft: '10px', backgroundColor: '#b3202e', borderColor: '#b3202e', padding: '0.5rem 1rem' }}>
              Filter
            </button>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div style={{ width: '100%', height: '400px' }}>
              <Bar data={chartData} id="serviceChart" options={options} />
            </div>
            <button className="btn btn-danger w-50" onClick={generatePDFChart} style={{ borderRadius: '0.3rem', marginTop: '1rem', backgroundColor: '#b3202e', borderColor: '#b3202e' }}>
              Download Chart as PDF
            </button>
          </div>

          <div className="col-md-6">
            <table className="table table-striped table-hover" style={{ borderRadius: '0.5rem', overflow: 'hidden' }}>
              <thead className="thead-light">
                <tr>
                  <th>Date</th>
                  <th>Parts Used</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, index) => (
                  <tr key={index}>
                    <td>{service.date}</td>
                    <td>{service.parts}</td>
                    <td>{service.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-danger  w-50" onClick={generatePDFTable} style={{ borderRadius: '0.3rem', marginTop: '1rem', backgroundColor: '#b3202e', borderColor: '#b3202e' }}>
              Download The Table
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
          <a
            href={`mailto:inventorymanager@example.com?subject=Service%20Inquiry&body=${generateEmailBody()}`}
            className="btn btn-secondary "
            style={{ borderRadius: '0.3rem', backgroundColor: '#b3202e', borderColor: '#b3202e' }}
          >
            Contact Inventory Manager
          </a>
          <button
            className="btn btn-danger "
            onClick={() => navigate('/serviceRecords')}
            style={{ borderRadius: '0.3rem', marginLeft: '10px', backgroundColor: '#b3202e', borderColor: '#b3202e' }}
          >
            Services
          </button>
          <button
            className="btn btn-success "
            onClick={() => navigate('/serviceeqrCodes')}
            style={{ borderRadius: '0.3rem', marginLeft: '10px', width: '200px', backgroundColor: '#b3202e', borderColor: '#b3202e' }}
          >
            QR Codes
          </button>
          <button
            className="btn btn-success "
            onClick={() => navigate('/servicepartsusage')}
            style={{ borderRadius: '0.3rem', marginLeft: '10px', width: '200px', backgroundColor: '#b3202e', borderColor: '#b3202e' }}
          >
            View Parts Usage
          </button>
          <button
            className="btn btn-success "
            onClick={() => navigate('/serviceDashboard')}
            style={{ borderRadius: '0.3rem', marginLeft: '10px', width: '200px', backgroundColor: '#b3202e', borderColor: '#b3202e' }}
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceReports;
