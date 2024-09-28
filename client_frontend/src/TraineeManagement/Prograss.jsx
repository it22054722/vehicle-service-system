import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

function Progress() {
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState("");
  const [traineeDetails, setTraineeDetails] = useState(null);
  const [attendance, setAttendance] = useState(0);
  const [tasks, setTasks] = useState({
    oilChanging: 0,
    wheelAlignment: 0,
    batteryService: 0,
    airConditioning: 0,
    interiorService: 0,
    hybridService: 0
  });
  const [showChart, setShowChart] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate(); // useNavigate hook for navigation

  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then((response) => setTrainees(response.data))
      .catch((error) => console.log("Error fetching trainees:", error));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedTrainee) {
      newErrors.trainee = "Please select a trainee.";
    }

    if (attendance < 0 || attendance > 100) {
      newErrors.attendance = "Attendance must be between 0 and 100.";
    }

    Object.keys(tasks).forEach((task) => {
      if (tasks[task] < 0 || tasks[task] > 100) {
        newErrors[task] = `${task} progress must be between 0 and 100.`;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleTraineeChange = (e) => {
    const traineeId = e.target.value;
    setSelectedTrainee(traineeId);

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
            } else {
              setAttendance(0);
              setTasks({
                oilChanging: 0,
                wheelAlignment: 0,
                batteryService: 0,
                airConditioning: 0,
                interiorService: 0,
                hybridService: 0
              });
            }
          })
          .catch((error) => console.log("Error fetching progress details:", error));
      })
      .catch((error) => console.log("Error fetching trainee details:", error));
  };

  const handleTaskChange = (task, value) => {
    setTasks({ ...tasks, [task]: value });
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const progressData = {
      trainee_id: selectedTrainee,
      attendance,
      tasks
    };

    axios
      .get(`http://localhost:3001/getProgress/${selectedTrainee}`)
      .then((response) => {
        if (response.data) {
          axios
            .put(`http://localhost:3001/updateProgress/${selectedTrainee}`, progressData)
            .then((response) => {
              setShowChart(true);
              console.log("Progress updated:", response.data);
            });
        } else {
          axios
            .post("http://localhost:3001/createProgress", progressData)
            .then((response) => {
              setShowChart(true);
              console.log("Progress created:", response.data);
            });
        }
      })
      .catch((error) => console.log("Error saving progress:", error));
  };

  const handleDelete = () => {
    if (!selectedTrainee) {
      setErrors({ trainee: "Please select a trainee to delete progress." });
      return;
    }

    axios
      .delete(`http://localhost:3001/deleteProgress/${selectedTrainee}`)
      .then(() => {
        setAttendance(0);
        setTasks({
          oilChanging: 0,
          wheelAlignment: 0,
          batteryService: 0,
          airConditioning: 0,
          interiorService: 0,
          hybridService: 0
        });
        setShowChart(false);
        setErrors({});
        console.log("Progress deleted");
      })
      .catch((error) => console.log("Error deleting progress:", error));
  };

  const handleReport = () => {
    if (!selectedTrainee) {
      setErrors({ trainee: "Please select a trainee to generate a report." });
      return;
    }
    console.log("Report button clicked!");
    navigate("/report", { state: { traineeId: selectedTrainee } }); // Redirect to the report page with traineeId
  };

  const data = {
    labels: [
      "Oil Changing",
      "Wheel Alignment",
      "Battery Service",
      "Air Conditioning",
      "Interior/Exterior Service",
      "Hybrid/Electric Service"
    ],
    datasets: [
      {
        label: "Progress (%)",
        data: [
          tasks.oilChanging,
          tasks.wheelAlignment,
          tasks.batteryService,
          tasks.airConditioning,
          tasks.interiorService,
          tasks.hybridService
        ],
        backgroundColor: "rgba(153, 0, 0, 0.6)",
        borderColor: "rgba(153, 0, 0, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(153, 0, 0, 0.8)"
      }
    ]
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center">
      <div className="w-75 shadow-lg rounded p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        
        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '65px', fontSize: '2.5rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
          Select Trainee to View Progress
        </h3>

        <select
          className="form-select mb-3 border-primary"
          value={selectedTrainee}
          onChange={handleTraineeChange}
        >
          <option value="">Select Trainee</option>
          {trainees.map((trainee) => (
            <option key={trainee._id} value={trainee._id}>
              {trainee.trainee_id} - {trainee.name}
            </option>
          ))}
        </select>
        {errors.trainee && <p className="text-danger">{errors.trainee}</p>}

        {selectedTrainee && traineeDetails && (
          <div className="mt-3">
            <h5 className="mb-3" style={{color: "#8B0000"}}>Progress for Trainee ID: {traineeDetails.trainee_id}</h5>
            <p className="text-muted">Name: {traineeDetails.name}</p>
            <p className="text-muted">Email: {traineeDetails.email}</p>
            <p className="text-muted">Phone: {traineeDetails.phone_number}</p>
            <p className="text-muted">Trainee Period: {traineeDetails.trainee_periode}</p>

            <div className="mt-3">
              <h6 className="text-secondary">Attendance</h6>
              <input
                type="number"
                className="form-control border-primary mb-3"
                max="100"
                min="0"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
              />
              {errors.attendance && <p className="text-danger">{errors.attendance}</p>}
            </div>

            <div className="mt-3">
              <h6 className="text-secondary">Task Progress</h6>
              {Object.keys(tasks).map((task) => (
                <div key={task} className="mb-3">
                  <label className="text-muted">{task.replace(/([A-Z])/g, " $1")}:</label>
                  <input
                    type="number"
                    className="form-control border-primary"
                    max="100"
                    min="0"
                    value={tasks[task]}
                    onChange={(e) => handleTaskChange(task, e.target.value)}
                  />
                  {errors[task] && <p className="text-danger">{errors[task]}</p>}
                </div>
              ))}
            </div>

            <div className="mt-4 d-flex justify-content-between">
              <div className="d-flex gap-3">
                <button className="btn" style={{
              backgroundColor: "#8B0000", // Dark red color
              color: "#fff",
            }} onClick={handleSave}>
                  Save Progress
                </button>
                <button className="btn" style={{
              backgroundColor: "#8B0000", // Dark red color
              color: "#fff",
            }} onClick={handleDelete}>
                  Delete Progress
                </button>
              </div>
              <div>
                <button className="btn" style={{
              backgroundColor: "#8B0000", // Dark red color
              color: "#fff",
            }} onClick={handleReport}>
                  Generate Report
                </button>
              </div>
            </div>

            {showChart && (
              <div className="mt-5">
                <h5 className="mb-5" style={{color: "#8B0000"}}>Progress Chart</h5>
                <Bar data={data} />
              </div>
            )}
          </div>
        )}

{/* Back Button */}
<div className="mt-4 d-flex justify-content-center">
          <button
            className="btn"
            style={{
              backgroundColor: "black", // Black color for the button
              color: "#fff"
            }}
            onClick={() => navigate("/traineedashboard")} // Navigate to dashboard on click
          >
            Back to Dashboard
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Progress;
