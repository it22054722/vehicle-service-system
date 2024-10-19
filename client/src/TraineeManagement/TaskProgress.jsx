import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useNavigate } from "react-router-dom"; // For navigation
import jsPDF from "jspdf";
import "jspdf-autotable"; // For generating table in PDF

function TaskProgress() {
  const [tasks] = useState([
    "oilChanging",
    "wheelAlignment",
    "batteryService",
    "airConditioning",
    "interiorService",
    "hybridService"
  ]);
  const [selectedTask, setSelectedTask] = useState("");
  const [traineeProgress, setTraineeProgress] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTask) {
      axios
        .get("http://localhost:3001/trainees") // Fetch trainees
        .then((response) => {
          const trainees = response.data;
          const progressPromises = trainees.map((trainee) =>
            axios
              .get(`http://localhost:3001/getProgress/${trainee._id}`)
              .then((progressResponse) => ({
                trainee,
                progress: progressResponse.data ? progressResponse.data.tasks[selectedTask] : 0
              }))
          );

          // Wait for all the progress data to be fetched
          Promise.all(progressPromises)
            .then((progressData) => {
              setTraineeProgress(progressData);
              setShowChart(true);
            })
            .catch((error) => console.log("Error fetching progress data:", error));
        })
        .catch((error) => console.log("Error fetching trainees:", error));
    }
  }, [selectedTask]);

  const handleTaskChange = (event) => {
    setSelectedTask(event.target.value);
    setShowChart(false); // Reset the chart visibility when a new task is selected
  };

  const data = {
    labels: traineeProgress.map((entry) => entry.trainee.name),
    datasets: [
      {
        label: `${selectedTask.replace(/([A-Z])/g, " $1")} Progress (%)`,
        data: traineeProgress.map((entry) => entry.progress),
        backgroundColor: "#c74545",
        borderColor: "#8B0000",
        borderWidth: 1,
        hoverBackgroundColor: "#A52A2A"
      }
    ]
  };

  const options = {
    scales: {
      x: {
        ticks: {
          font: {
            size: 14 // Smaller font size for labels
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12 // Smaller font size for labels
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16 // Smaller legend font
          },
          color: "#c74545" // Legend color matching the chart
        }
      }
    },
    maintainAspectRatio: false // Disable the default aspect ratio to make chart smaller
  };

  // Sort trainees by progress in descending order
  const sortedTrainees = [...traineeProgress].sort((a, b) => b.progress - a.progress);

  // Function to download the content (styled PDF report)
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(22);
    doc.setTextColor("#8B0000");
    doc.text("Trainee Progress Report", 20, 20);

    // Add subtitle with the task name
    doc.setFontSize(16);
    doc.setTextColor("#404040");
    doc.text(`Task: ${selectedTask.replace(/([A-Z])/g, " $1")}`, 20, 30);

    // Table headers
    const headers = [["Trainee Name", "Progress (%)"]];

    // Data for table
    const data = sortedTrainees.map((entry) => [
      entry.trainee.name,
      `${entry.progress || 0} %`
    ]);

    // Generate table with headers and data
    doc.autoTable({
      startY: 40,
      head: headers,
      body: data,
      theme: "grid",
      styles: {
        fontSize: 12,
        halign: "center",
        valign: "middle",
        lineColor: "#8B0000",
        lineWidth: 0.3
      },
      headStyles: {
        fillColor: "#c74545",
        textColor: "#fff"
      },
      alternateRowStyles: {
        fillColor: "#f5f5f5"
      }
    });

    // Add footer
    doc.setFontSize(10);
    doc.text(
      `Report generated on ${new Date().toLocaleString()}`,
      20,
      doc.internal.pageSize.height - 10
    );

    // Save the PDF
    doc.save(`Trainee_Progress_Report_${selectedTask}.pdf`);
  };


  return (
    <div
    className="d-flex vh-100 justify-content-center align-items-center position-relative"
    style={{
      background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.6), rgba(0, 0, 0, 0.5), rgba(139, 0, 0, 0.5))',
      backdropFilter: 'blur(10px)', // Light blur effect
    }}
  >
      <div className="w-75 shadow-lg rounded p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #8B0000' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2.5rem', fontWeight: 'bold', color: '#8B0000' }}>
          Select Task to View Progress of All Trainees
        </h3>

        {/* Task dropdown */}
        <div className="task-dropdown mb-4">
          <select
            className="form-select"
            value={selectedTask}
            onChange={handleTaskChange}
            style={{
              padding: "10px",
              borderColor: "#8B0000",
              fontSize: "1rem",
              fontWeight: "bold",
              height: "45px",
              backgroundColor: "#f9f9f9"
            }}
          >
            <option value="">Select Task</option>
            {tasks.map((task) => (
              <option key={task} value={task}>
                {task.replace(/([A-Z])/g, " $1")}
              </option>
            ))}
          </select>
        </div>

        {showChart && (
          <>
            {/* List of trainees sorted by progress */}
            <div className="mb-4">
              <h5 style={{ color: "#8B0000", fontWeight: "bold" }}>
                Trainee Progress for {selectedTask.replace(/([A-Z])/g, " $1")}
              </h5>
              <ul className="list-group" style={{color:"#000000", fontWeight:"bold", fontsize:"1rem"}}>
                {sortedTrainees.map((entry) => {
                  const { progress } = entry;
                  let percentageStyle = {};

                  // Set styles based on progress percentage
                  if (progress > 75) {
                    percentageStyle = { color: '#404040' }; // Dark grey
                  } else if (progress > 45) {
                    percentageStyle = { color: '#b35900' }; // Light grey
                  } else {
                    percentageStyle = {
                      color: 'red',
                      animation: 'blinking 1s infinite',
                      fontWeight: 'bold'
                    }; // Blinking red
                  }

                  return (
                    <li key={entry.trainee._id} className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f5f5f5', borderColor: '#8B0000' }}>
                      {entry.trainee.name}
                      <span className="badge rounded-pill" style={percentageStyle}>
                        {progress || 0} %
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Chart Display */}
            <div className="mt-5" style={{ height: "500px" }}>
              <h5 className="mb-5" style={{ color: "#8B0000" }}>
                Progress for {selectedTask.replace(/([A-Z])/g, " $1")} across Trainees
              </h5>
              <Bar data={data} options={options} />
            </div>
          </>
        )}

        {/* Back Button */}
        <div className="mt-4 d-flex justify-content-center">
          <button
            className="btn"
            style={{
              backgroundColor: "black",
              color: "#fff",
              marginTop: "70px",
              border: '1px solid #8B0000'
            }}
            onClick={() => navigate("/traineeprogess")} // Navigate to dashboard on click
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mt-4 d-flex justify-content-center">
          {/* Download Button */}
        {showChart && (
          <button
            onClick={handleDownloadPDF}
            className="btn btn-danger mt-4"
            style={{
              backgroundColor: "black",
              color: "#fff",
              marginTop: "70px",
              border: '1px solid #8B0000',
              width:"160px"
            }}
          >
            Download Report
          </button>
        )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blinking {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default TaskProgress;
