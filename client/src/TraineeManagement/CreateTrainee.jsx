import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function CreateTrainee() {
  const [trainee_id, setID] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [trainee_periode, setTperiode] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPnumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    if (!trainee_id || !name || !age || !trainee_periode || !email || !phone_number) {
      return "All fields are required.";
    }
    if (!/^\d+$/.test(age) || age <= 18) {
      return "Only numbers are required & must be greater than 18";
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Invalid email format.";
    }
    if (!/^\d{10}$/.test(phone_number)) {
      return "Phone number must be 10 digits & do not enter characters.";
    }
    if (/[^a-zA-Z\s]/.test(name)) {
      return "Name cannot contain numbers or symbols.";
    }
    return "";
  };

  const checkTraineeID = async () => {
    try {
      const response = await axios.get("http://localhost:3001/trainees"); // Fetch all trainees
      return response.data.some(trainee => trainee.trainee_id === trainee_id);
    } catch (error) {
      console.log("Error fetching trainee data:", error);
      return false;
    }
  };

  const Submit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(""); // Clear existing errors

    const idExists = await checkTraineeID(); // Check if trainee ID exists
    if (idExists) {
      setError("This trainee ID is already in the system.");
      return; // Stop form submission if trainee ID is duplicate
    }

    axios.post("http://localhost:3001/createTrainee", { trainee_id, name, age, trainee_periode, email, phone_number })
      .then(result => {
        console.log(result);
        Swal.fire({
          title: 'Success!',
          text: 'Trainee successfully added.',
          icon: 'success',
          timer: 1500, // Optional: auto-close the alert after 1.5 seconds
          showConfirmButton: false // No confirm button needed
        });
        navigate('/trainee'); // Navigate to trainee list after success
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ width: '400px', height: '600px', overflowY: 'auto', borderRadius: '20px', marginTop: '75px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <form onSubmit={Submit}>
          <h1
            className="mb-5"
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              fontSize: "2.5rem",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
              color: "#000",
            }}
          >
            Add Trainee 
          </h1>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label htmlFor="trainee_id" className="form-label">Trainee ID</label>
            <input
              type="text"
              className="form-control"
              id="trainee_id"
              placeholder="Enter ID"
              autoComplete="off"
              onChange={(e) => setID(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter Name"
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              type="text"
              className="form-control"
              id="age"
              placeholder="Enter Age"
              autoComplete="off"
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="trainee_periode" className="form-label">Trainee Period</label>
            <select
              className="form-control"
              id="trainee_periode"
              value={trainee_periode}
              onChange={(e) => setTperiode(e.target.value)}
            >
              <option value="">Select Period</option>
              <option value="03 months">03 months</option>
              <option value="06 months">06 months</option>
              <option value="12 months">12 months</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              id="phone_number"
              placeholder="Enter Phone number"
              autoComplete="off"
              onChange={(e) => setPnumber(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-sm w-50" style={{
              backgroundColor: "#8B0000", // Dark red color
              color: "#fff",
            }}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTrainee;
