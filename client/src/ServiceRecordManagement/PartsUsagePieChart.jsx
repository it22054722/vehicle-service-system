import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import backgroundImage from './assets/supercars.png';

const PieChartPage = () => {
  const [serviceData, setServiceData] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then((result) => setServiceData(result.data))
      .catch((err) => console.log(err));
  }, []);

  const getPartsData = () => {
    const partsUsage = {};
    serviceData.forEach((service) => {
      const part = service.parts;
      const quantity = service.quantity;
      if (partsUsage[part]) {
        partsUsage[part] += quantity;
      } else {
        partsUsage[part] = quantity;
      }
    });

    return {
      labels: Object.keys(partsUsage),
      datasets: [
        {
          data: Object.values(partsUsage),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
            "#FF9F40", "#8E44AD", "#3498DB", "#E74C3C", "#1ABC9C",
            "#9B59B6", "#F1C40F", "#27AE60", "#D35400", "#2C3E50",
            "#E67E22", "#C0392B", "#BDC3C7", "#34495E", "#2ECC71"
          ],
          hoverBackgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
            "#FF9F40", "#8E44AD", "#3498DB", "#E74C3C", "#1ABC9C",
            "#9B59B6", "#F1C40F", "#27AE60", "#D35400", "#2C3E50",
            "#E67E22", "#C0392B", "#BDC3C7", "#34495E", "#2ECC71"
          ],
        },
      ],
    };
  };

  const downloadPDF = () => {
    const input = document.getElementById("pie-chart-container");
    html2canvas(input, { scale: 2 }).then((canvas) => { 
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4"); 
      const imgWidth = 200; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width; 
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("PartsUsageChart.pdf");
    });
  };

  return (
    <div 
      className="container" 
      style={{
        padding: '2rem',
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        minWidth: '210vh',
        color: '#fff',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      
      <h2 className="text-center my-4" style={{ color: '#fff',paddingTop: '30px', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>Parts Usage Pie Chart</h2>
      <div id="pie-chart-container" style={{ width: "500px", margin: "0 auto", backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '50px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
        <Pie data={getPartsData()} />
      </div>
      <div className="text-center mt-3">
        <button className="btn" onClick={downloadPDF} style={{ backgroundColor: '#a1192d', color: '#fff', borderRadius: '0.5rem', marginTop: '10px' }}>
          Download
        </button>
      </div>
      <button
        className="btn"
        onClick={() => navigate('/reports')}
        style={{ backgroundColor: '#a1192d', color: '#fff', borderRadius: '0.5rem', marginLeft: '10px' }}
      >
        Reports
      </button>&nbsp;

      <button
        className="btn"
        onClick={() => navigate('/dashboard')}
        style={{ backgroundColor: '#a1192d', color: '#fff', borderRadius: '0.5rem', marginLeft: '10px' }}
      >
        Dashboard
      </button>
    </div>
  );
};

export default PieChartPage;
