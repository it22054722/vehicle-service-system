import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa"; // Import the edit icon
import { AiOutlineDelete } from "react-icons/ai"; // Import a different trash icon

function Trainees() {
  const [Trainees, setTrainee] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then((result) => setTrainee(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3001/deleteTrainee/" + id)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center">
      <div
        className="w-75 rounded p-3"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
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
          Trainee Table
        </h1>
        <div className="d-flex justify-content-between mb-3">
          <Link
            to="/traineecreate"
            className="btn btn-sm"
            style={{
              backgroundColor: "#8B0000", // Dark red color
              color: "#fff",
            }}
          >
            Add +
          </Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Trainee ID</th>
              <th>Trainee Name</th>
              <th>Age</th>
              <th>Trainee Period</th>
              <th>Email</th>
              <th>Phone number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Trainees.map((Trainee) => {
              return (
                <tr key={Trainee._id}>
                  <td>{Trainee.trainee_id}</td>
                  <td>{Trainee.name}</td>
                  <td>{Trainee.age}</td>
                  <td>{Trainee.trainee_periode}</td>
                  <td>{Trainee.email}</td>
                  <td>{Trainee.phone_number}</td>
                  <td>
                    <Link
                      to={`/traineeupdate/${Trainee._id}`}
                      className="btn btn-sm"
                      style={{
                        color: "grey", // Set the edit icon color to grey
                        backgroundColor: "transparent", // Make the background transparent
                        border: "none", // Remove button border
                        padding: "0", // Remove padding
                      }}
                    >
                      <FaEdit size={20} /> {/* Edit icon with increased size */}
                    </Link>
                    &nbsp;&nbsp;
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "transparent", // Make the background transparent
                        border: "none", // Remove button border
                        padding: "0", // Remove padding
                      }}
                      onClick={(e) => handleDelete(Trainee._id)}
                    >
                      <AiOutlineDelete size={20} color="red" /> {/* New trash icon with increased size */}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Centered Back button */}
        <div className="text-center mt-4">
          <Link
            to="/traineedashboard"
            className="btn btn-sm"
            style={{
              backgroundColor: "#8B0000", // Dark red color
              color: "#fff",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Trainees;
