import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ServiceReports.css'; // Import the CSS file

function ServiceReports() {
  const [totalServices, setTotalServices] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [mostCommonParts, setMostCommonParts] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [serviceFilter, setServiceFilter] = useState('');

  const navigate = useNavigate();

  const handleTotalServicesClick = () => {
    navigate('/ServiceInfographic'); // Navigate to the infographic page
  };

  const handleMostCommonlyUsedParts = () => {
    navigate('/PartsUsageTable'); // Navigate to the infographic page
  };

  const handleRevenueAreaChart = () => {
    navigate('/RevenueAreaChart'); // Navigate to the infographic page
  };

  const handlePartClick = (part) => {
    navigate('/PartDetails', { state: { part } }); // Navigate to PartDetails and pass the part
  };

  useEffect(() => {
    // Fetch service data
    axios
      .get("http://localhost:3001/Services")
      .then((result) => {
        const servicesData = result.data;
        setServices(servicesData);
        setFilteredServices(servicesData); // Initialize filtered services

        // Calculate total services completed
        setTotalServices(servicesData.length);

        // Calculate total revenue
        const revenue = servicesData.reduce((acc, service) => acc + service.price, 0);
        setTotalRevenue(revenue);

        // Calculate most commonly used parts
        const partCount = {};
        servicesData.forEach(service => {
          if (service.parts) {
            service.parts.split(', ').forEach(part => {
              partCount[part] = (partCount[part] || 0) + 1;
            });
          }
        });
        const sortedParts = Object.entries(partCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5); // Get top 5 commonly used parts
        setMostCommonParts(sortedParts);
      })
      .catch((err) => {
        toast.error("Failed to fetch service records.");
      });
  }, []);

  useEffect(() => {
    let filtered = services;

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(service => {
        const serviceDate = new Date(service.date);
        return serviceDate >= new Date(dateRange.start) && serviceDate <= new Date(dateRange.end);
      });
    }

    // Filter by service type
    if (serviceFilter) {
      filtered = filtered.filter(service => service.service.toLowerCase().includes(serviceFilter.toLowerCase()));
    }

    setFilteredServices(filtered);
  }, [dateRange, serviceFilter, services]);

  // Create a unique list of services for the dropdown
  const uniqueServices = [...new Set(services.map(service => service.service))];

  // Calculate total price of filtered services
  const filteredTotalPrice = filteredServices.reduce((acc, service) => acc + service.price, 0);

  const generatePDF = () => {
    const input = document.getElementById('service-reports-content');
    const downloadButton = document.getElementById('download-pdf-btn');
    
    // Hide the download button
    downloadButton.style.display = 'none';
    
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("service-report.pdf");

      // Show the download button again
      downloadButton.style.display = 'block';
    });
  };

  return (
    <div className="service-reports-background">
      <div className="service-reports-container" id="service-reports-content">
        <h2 className="title">Service Reports</h2>

        {/* Filters */}
        <div className="filters-container">
          <h5>Filters</h5>
          <input
            type="date"
            className="filter-input"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            placeholder="Start Date"
          />
          <input
            type="date"
            className="filter-input"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            placeholder="End Date"
          />
          <select
            className="filter-select"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="">Filter by Service</option>
            {uniqueServices.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        <div className="cards-container">
          <div className="card" onClick={handleTotalServicesClick} style={{ cursor: 'pointer' }}>
            <div className="card">
              <h5>Total Services Completed</h5>
              <p>{totalServices}</p>
            </div>
          </div>

          <div className="card" onClick={handleRevenueAreaChart} style={{ cursor: 'pointer' }}>
            <div className="card">
              <h5>Total Revenue Generated (LKR)</h5>
              <p>Rs. {totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            </div>
          </div>

          <div className="card" onClick={handleMostCommonlyUsedParts} style={{ cursor: 'pointer' }}>
            <div className="card">
              <h5>Most Commonly Used Parts</h5>
              <ul className="parts-list">
                {mostCommonParts.map(([part, count]) => (
                  <li key={part}>{part}: {count} times</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card"  style={{ cursor: 'pointer' }}>
            <div className="card">
              <h5>Total Services in List</h5>
              <p>{filteredServices.length}</p>
            </div>
          </div>

          <div className="card" style={{ cursor: 'pointer' }}>
            {/* New card for Parts Used for Services */}
            <div className="card parts-used-card">
              <h5>Parts Used for filterd Service</h5>
              <ul className="parts-list">
                {filteredServices.map(service => (
                  <li key={service._id}>
                    {service.service}: {service.parts || 'No parts used'}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card" style={{ cursor: 'pointer' }}>
            {/* New card for Total Price of Filtered Services */}
            <div className="card total-price-card">
              <h5>Total Price Gained from the Filtered Service (LKR)</h5>
              <p>Rs. {filteredTotalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            </div>
          </div>
        </div>

        <button id="download-pdf-btn" onClick={generatePDF} className="download-pdf-btn">
          Download PDF
        </button>

        {/* Display filtered services */}
        <div className="filtered-services">
          <h4>Filtered Services</h4>
          <ul className="list-unstyled">
            {filteredServices.map(service => (
              <li key={service._id} className="filtered-service-item">
                {service.service} - Rs. {service.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} on {service.date}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ServiceReports;
