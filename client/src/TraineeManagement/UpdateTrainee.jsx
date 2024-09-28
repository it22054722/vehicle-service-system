import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

function UpdateTrainee() {
  const { id } = useParams();
  const [trainee_id, setID] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [trainee_periode, setTperiode] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPnumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/getTrainee/' + id)
      .then(result => {
        setID(result.data.trainee_id);
        setName(result.data.name);
        setAge(result.data.age);
        setTperiode(result.data.trainee_periode);
        setEmail(result.data.email);
        setPnumber(result.data.phone_number);
      })
      .catch(err => console.log(err));
  }, [id]);

  const validate = () => {
    if (!trainee_id || !name || !age || !trainee_periode || !email || !phone_number) {
      return "All fields are required.";
    }
    if (isNaN(age) || age <= 18) {
      return "Age must be a greater than 18.";
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Invalid email format.";
    }
    if (!/^\d{10}$/.test(phone_number)) {
      return "Phone number must be 10 digits.";
    }
    if (/[^a-zA-Z\s]/.test(name)) {
      return "Name cannot contain numbers or symbols.";
    }
    return "";
  };

  const Update = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");

    axios.put("http://localhost:3001/updateTrainee/" + id, { trainee_id, name, age, trainee_periode, email, phone_number })
      .then(result => {
        console.log(result);
        navigate('/trainee');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ width: '400px', height: '600px', overflowY: 'auto', borderRadius: '20px', marginTop: '75px', backgroundColor: 'rgba(255, 255, 255, 0.8)'  }}>
        <form onSubmit={Update}>
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
          Update Trainee 
        </h1>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label htmlFor="Trainee_id" className="form-label">Trainee ID</label>
            <input
              type="text"
              className="form-control"
              id="Trainee_id"
              placeholder="Enter ID"
              autoComplete='off'
              value={trainee_id}
              onChange={(e) => setID(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="Name"
              placeholder="Enter Name"
              autoComplete='off'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Age" className="form-label">Age</label>
            <input
              type="text"
              className="form-control"
              id="Age"
              placeholder="Enter Age"
              autoComplete='off'
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Trainee_Periode" className="form-label">Trainee Period</label>
            <select
              className="form-control"
              id="Trainee_Periode"
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
            <label htmlFor="Email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="Email"
              placeholder="Enter Email"
              autoComplete='off'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Phone_Number" className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              id="Phone_Number"
              placeholder="Enter Phone number"
              autoComplete='off'
              value={phone_number}
              onChange={(e) => setPnumber(e.target.value)}
            />
          </div>
          <div align="center">
            <button type="submit" className="btn btn-sm  w-20" style={{
              backgroundColor: "#8B0000", // Dark red color
              color: "#fff",
            }}>Update</button>
          </div>
           
        </form>
      </div>
    </div>
  );
}

export default UpdateTrainee;
