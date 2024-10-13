import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, registerables } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './ServiceInfographic.css'; 

ChartJS.register(...registerables);

function ServiceInfographic() {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

  useEffect(() => {
    // Fetch service data
    axios
      .get("http://localhost:3001/Services")
      .then((result) => {
        const servicesData = result.data;

        // Prepare data for the line chart
        const serviceCount = {};
        servicesData.forEach(service => {
          const date = new Date(service.date).toLocaleDateString(); // Format date
          serviceCount[date] = (serviceCount[date] || 0) + 1;
        });

        // Sort dates and prepare labels and data points
        const sortedDates = Object.keys(serviceCount).sort();
        const serviceCounts = sortedDates.map(date => serviceCount[date]);

        setLabels(sortedDates);
        setData(serviceCounts);
      })
      .catch((err) => {
        console.error("Failed to fetch service records.", err);
      });
  }, []);

  // Line chart data
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Services Completed",
        data: data,
        borderColor: "darkred",
        backgroundColor: "rgba(139, 0, 0, 0.3)", // Light dark red background for area fill
        borderWidth: 3, // Thicker border
        fill: true,
        tension: 0.4, // Smooth lines
        pointRadius: 5, // Size of data points
        pointHoverRadius: 7, // Size of data points on hover
        pointBackgroundColor: "darkred", // Point color
        pointBorderColor: "#fff", // Point border color
      },
    ],
  };

  // Line chart options with animations and hover effects
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow flexibility in size
    animation: {
      duration: 1000, // Animation duration in milliseconds
      easing: 'easeInOutQuad', // Easing function for animations
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "darkred",
          font: {
            size: 14, // Increased font size
            weight: 'bold', // Bold font
          },
        },
        grid: {
          color: "rgba(139, 0, 0, 0.3)", // Lighter grid line color
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Services",
          color: "darkred",
          font: {
            size: 14, // Increased font size
            weight: 'bold', // Bold font
          },
        },
        beginAtZero: true,
        grid: {
          color: "rgba(139, 0, 0, 0.3)", // Lighter grid line color
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "darkred",
          font: {
            size: 14, // Increased font size
            weight: 'bold', // Bold font
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(139, 0, 0, 0.8)", // Dark red tooltip background
        titleColor: "#fff",
        bodyColor: "#fff",
        titleFont: {
          size: 12, // Tooltip title font size
          weight: 'bold', // Tooltip title font weight
        },
        bodyFont: {
          size: 12, // Tooltip body font size
        },
      },
    },
  };

  // Function to download the chart as a PDF
  const downloadPDF = () => {
    const input = document.querySelector('.chart-container'); // Select only the chart container
    const button = document.querySelector('.download-pdf-btn'); // Select the button

    // Hide the button while capturing the chart
    button.style.display = "none";

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

      pdf.save("service-infographic.pdf");
      toast.success("Chart downloaded successfully!"); // Show toast message
      button.style.display = "block"; // Show the button again
    });
  };

  return (
    <div className="infographic-container" style={{ marginTop: "120px" }}>
      <h2>Services completed</h2>
      
      {/* Dropdown Icon */}
      <div className="dropdown" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <span
          className="dropdown-icon"
          onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown on icon click
        >
          ⋮ {/* Three-dot icon */}
        </span>
        
        {/* Dropdown Box */}
        {dropdownOpen && (
          <div className={`dropdown-box ${dropdownOpen ? 'show' : ''}`}>
            <nav>
              <ul>
              <li><a href="/serviceDashboard">Dashboard</a></li>
              <li><a href="/serviceRecords">Services</a></li>
              <li><a href="/Servicereports">Service Reports</a></li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      <div className="chart-container" style={{ position: "relative", width: "100%", height: "400px", marginTop: "20px" }}>
        <Line data={chartData} options={options} />
      </div>
      <button onClick={downloadPDF} className="download-pdf-btn">Download Chart as PDF</button>
      <ToastContainer />
    </div>
  );
}

export default ServiceInfographic;
