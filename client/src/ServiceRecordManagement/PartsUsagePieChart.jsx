import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StackedBarChartPage = () => {
  const [serviceData, setServiceData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/Services")
      .then((result) => setServiceData(result.data))
      .catch((err) => console.log(err));
  }, []);

  const getStackedBarData = () => {
    // Prepare the data for the Stacked Bar Chart
    const partsUsage = {};
    const services = [...new Set(serviceData.map((service) => service.serviceName))]; // Get unique services

    // Initialize the partsUsage structure
    serviceData.forEach((service) => {
      const part = service.parts;
      const quantity = service.quantity;
      const serviceName = service.serviceName;

      if (!partsUsage[part]) {
        partsUsage[part] = {};
      }
      partsUsage[part][serviceName] = (partsUsage[part][serviceName] || 0) + quantity;
    });

    // Prepare datasets for each service
    const datasets = services.map((service) => ({
      label: service,
      data: Object.keys(partsUsage).map((part) => partsUsage[part][service] || 0),
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
    }));

    return {
      labels: Object.keys(partsUsage), // Part names
      datasets: datasets, // Data per service stacked on top of each other
    };
  };

  const downloadPDF = () => {
    const input = document.getElementById("bar-chart-container");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgWidth = 200;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const date = new Date().toLocaleDateString();

      // Header
      pdf.setFillColor(200, 200, 200);
      pdf.rect(0, 0, 297, 60, "F");
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(24);
      pdf.text("Parts Usage Report", 20, 30);
      pdf.setFontSize(12);
      pdf.text(`Date: ${date}`, 250, 40);

      // Chart
      pdf.addImage(imgData, "PNG", 10, 70, imgWidth, imgHeight);
      pdf.save("PartsUsageChart.pdf");
    });

    Swal.fire({
      icon: "success",
      title: "Downloaded!",
      text: "Service table PDF downloaded successfully.",
      confirmButtonColor: "#b3202e",
      background: "#fff",
      color: "#333",
    });
  };

  return (
    <div
    className="d-flex vh-100 justify-content-center align-items-center"
    style={{
      background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.6), rgba(0, 0, 0, 0.5), rgba(139, 0, 0, 0.5))',backdropFilter: 'blur(10px)',
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div
      className="container"
      style={{
        padding: "2rem",
        background: "linear-gradient(135deg, #fff, #fff)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2 className="text-center" style={{ paddingTop: "30px", textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>
        Parts Usage Chart
      </h2>

      <div className="chart-section" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "30px" }}>
        <div id="bar-chart-container" style={{
          width: '800px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          border: '2px solid #a1192d',
        }}>
          <Bar
            data={getStackedBarData()}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Parts Usage across Different Services",
                },
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="buttons" style={{ display: 'flex', justifyContent: 'space-between', width: '80%' }}>
        <button className="btn" onClick={downloadPDF} style={{
          backgroundColor: '#a1192d', color: '#fff', borderRadius: '0.5rem', padding: '10px 20px',
          border: '2px solid #fff', transition: '0.3s', cursor: 'pointer',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#8b0000'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#a1192d'}
        >Download PDF</button>
        <button className="btn" onClick={() => navigate('/Servicereports')} style={{
          backgroundColor: '#a1192d', color: '#fff', borderRadius: '0.5rem', padding: '10px 20px',
          border: '2px solid #fff', transition: '0.3s', cursor: 'pointer',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#8b0000'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#a1192d'}
        >Reports</button>
        <button className="btn" onClick={() => navigate('/serviceDashboard')} style={{
          backgroundColor: '#a1192d', color: '#fff', borderRadius: '0.5rem', padding: '10px 20px',
          border: '2px solid #fff', transition: '0.3s', cursor: 'pointer',
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#8b0000'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#a1192d'}
        >Dashboard</button>
      </div>
    </div>
    </div>
  );
};

export default StackedBarChartPage;
