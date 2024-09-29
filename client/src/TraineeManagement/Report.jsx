import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import '../App.css'; // Import the CSS file for styles

function traineereport() {
  const [traineeDetails, setTraineeDetails] = useState(null);
  const [attendance, setAttendance] = useState(0);
  const [tasks, setTasks] = useState({});
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null); // Reference for the chart

  const location = useLocation();
  const navigate = useNavigate();

  const traineeId = location.state?.traineeId || ""; // Get trainee ID passed from the previous page

  useEffect(() => {
    if (traineeId) {
      axios
        .get(`http://localhost:3001/getTrainee/${traineeId}`)
        .then((response) => {
          setTraineeDetails(response.data);

          axios
            .get(`http://localhost:3001/getProgress/${traineeId}`)
            .then((progressResponse) => {
              const progress = progressResponse.data;
              if (progress) {
                setAttendance(progress.attendance);
                setTasks(progress.tasks);
                createChartData(progress.tasks);
              }
            })
            .catch((error) =>
              console.log("Error fetching progress details:", error)
            );
        })
        .catch((error) =>
          console.log("Error fetching trainee details:", error)
        );
    }
  }, [traineeId]);

  const createChartData = (tasks) => {
    setChartData({
      labels: [
        "Oil Changing",
        "Wheel Alignment",
        "Battery Service",
        "Air Conditioning",
        "Interior Service",
        "Hybrid Service",
      ],
      datasets: [
        {
          label: "Task Progress (%)",
          data: [
            tasks.oilChanging,
            tasks.wheelAlignment,
            tasks.batteryService,
            tasks.airConditioning,
            tasks.interiorService,
            tasks.hybridService,
          ],
          backgroundColor: "rgba(210, 121, 121, 0.6)",
          borderColor: "rgba(210, 121, 121,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(210, 121, 121, 0.8)",
        },
      ],
    });
  };

  const getProgressEvaluation = (tasks) => {
    const totalProgress =
      tasks.oilChanging +
      tasks.wheelAlignment +
      tasks.batteryService +
      tasks.airConditioning +
      tasks.interiorService +
      tasks.hybridService;
    const avgProgress = totalProgress / 6;

    if (avgProgress > 80) {
      return "Excellent";
    } else if (avgProgress > 60) {
      return "Good";
    } else if (avgProgress > 40) {
      return "Average";
    } else {
      return "Needs Improvement";
    }
  };

  const downloadPDF = () => {
    const reportElement = document.getElementById("reportContent");
    const chartElement = chartRef.current; // Get chart reference
  
    // Hide buttons before generating PDF
    document.getElementById("downloadButton").style.display = "none";
    document.getElementById("sendReportButton").style.display = "none";
    document.getElementById("goBackButton").style.display = "none";
  
    Promise.all([
      html2canvas(reportElement, { scale: 1 }), // Scale down for smaller size
      html2canvas(chartElement, { scale: 1 }), // Scale down for smaller size
    ]).then((canvasArray) => {
      const reportImgData = canvasArray[0].toDataURL("image/png");
      const chartImgData = canvasArray[1].toDataURL("image/png");
  
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth() - 20; // PDF width with margins
      const imgHeightReport = (canvasArray[0].height * imgWidth) / canvasArray[0].width;
      const imgHeightChart = (canvasArray[1].height * imgWidth) / canvasArray[1].width;
  
      // Add report content image with reduced size
      pdf.addImage(reportImgData, "PNG", 10, 10, imgWidth * 0.8, imgHeightReport * 0.8); // 90% of the original size
      // Add chart image below report content with reduced size
      pdf.addImage(chartImgData, "PNG", 10, 10 + imgHeightReport * 0.8 + 10, imgWidth * 0.8, imgHeightChart * 0.8); // 90% of the original size
  
      pdf.save(`Trainee_Report_${traineeId}.pdf`);
  
      // Show buttons again after PDF generation
      document.getElementById("downloadButton").style.display = "inline-block";
      document.getElementById("sendReportButton").style.display = "inline-block";
      document.getElementById("goBackButton").style.display = "inline-block";
    });
  };
  

  const sendReport = () => {
    const subject = encodeURIComponent("Trainee Progress Report");
    const body = encodeURIComponent(
      `Please find the progress report for trainee ${traineeDetails?.name} attached. 
      
      Attendance: ${attendance}%
      Oil Changing: ${tasks.oilChanging}%
      Wheel Alignment: ${tasks.wheelAlignment}%
      Battery Service: ${tasks.batteryService}%
      Air Conditioning: ${tasks.airConditioning}%
      Interior Service: ${tasks.interiorService}%
      Hybrid Service: ${tasks.hybridService}%`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center">
      <div className="w-75  shadow-lg rounded p-5 d-flex" style={{  backgroundColor: 'rgba(255, 255, 255, 0.8)', marginTop:"50px"}}>
        <div className="col-md-6 pe-4 report-content" id="reportContent">
          <h3
            className="mb-3" style={{color: "#8B0000", fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'}}
          >
            Trainee Progress Report
          </h3>

          {traineeDetails && (
            <>
              <h5 className="text-dark">Trainee Information</h5>
              <div
                style={{
                  backgroundColor: "#f0f5f9",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                }}
              >
                <p className="text-muted">Name: {traineeDetails.name}</p>
                <p className="text-muted">Email: {traineeDetails.email}</p>
                <p className="text-muted">Phone: {traineeDetails.phone_number}</p>
                <p className="text-muted">
                  Trainee Period: {traineeDetails.trainee_periode}
                </p>
                <p className="text-muted">Attendance: {attendance}%</p>
              </div>

              <div className="mt-4">
                <h5 className="text-dark">Task Progress</h5>
                <ul className="list-group">
                  <li className="list-group-item">
                    Oil Changing: {tasks.oilChanging}%
                  </li>
                  <li className="list-group-item">
                    Wheel Alignment: {tasks.wheelAlignment}%
                  </li>
                  <li className="list-group-item">
                    Battery Service: {tasks.batteryService}%
                  </li>
                  <li className="list-group-item">
                    Air Conditioning: {tasks.airConditioning}%
                  </li>
                  <li className="list-group-item">
                    Interior Service: {tasks.interiorService}%
                  </li>
                  <li className="list-group-item">
                    Hybrid Service: {tasks.hybridService}%
                  </li>
                </ul>
              </div>

              <div className="mt-4">
                <h5 className="text-dark">Overall Performance Evaluation</h5>
                <p
                  className="mb-2"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#8B0000",
                  }}
                >
                  {getProgressEvaluation(tasks)}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              id="downloadButton"
              className="btn btn-sm btn-success me-2"
              onClick={downloadPDF}
              style={{
                borderRadius: "20px",
                padding: "10px 20px",
                marginLeft:"20px",
                backgroundColor: "#8B0000", // Dark red color
              color: "#fff"
                
              }}
            >
              Download
            </button>
            <button
              id="sendReportButton"
              className="btn btn-sm btn-info"
              onClick={sendReport}
              style={{
                borderRadius: "20px",
                padding: "10px 20px",
                backgroundColor: "#8B0000", // Dark red color
              color: "#fff"
              }}
            >
              Send Report
            </button>
          </div>

          {chartData && (
            <div ref={chartRef} style={{ position: "relative" }}>
              <h4
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "600",
                  textAlign: "center"
                }}
              >
                Task Progress Chart
              </h4>
              <Bar data={chartData} options={{ responsive: true }} />

              <div className="mt-3">
        <button
          id="goBackButton"
          className="btn btn-sm btn-info"
          onClick={() => navigate(-1)}
          style={{
            borderRadius: "20px",
            padding: "10px 20px",
            marginTop:"120px",
            marginLeft:"420px",
            backgroundColor: "#8B0000", // Dark red color
              color: "#fff",
          }}
        >
          Go Back
        </button>
      </div>
            </div>
          )}
        </div>
        
      </div>
     
    </div>
  );
}

export default traineereport;
