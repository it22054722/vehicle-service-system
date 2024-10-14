import React from "react";
import { Link } from "react-router-dom";
//import backgroundImage from './assets/carrapaire.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const SupplierDashboard = () => {
  return (
    <div
     
    >
      <h1 style={{ textAlign: "center", fontSize: "3rem", marginTop: "30px", marginBottom: "3rem", textShadow: "4px 4px 6px rgba(0, 0, 0, 0.8)" }}>
        Supplier Manager Dashboard
      </h1>

      <div className="d-flex justify-content-around flex-wrap">
        {[
          { title: "Add Supplier", description: "Add new supplier details.", link: "/supplier/add" },
        { title: "All Suppliers", description: "View and manage all suppliers.", link: "/supplier/all" },
        ].map((card, index) => (
          <div
            key={index}
            className="card text-center m-3"
            style={{
              width: "18rem",
              borderRadius: "20px",
              background: "rgba(255, 0, 0, 0.2)",
              color: "#fff",
              boxShadow: "0 6px 30px rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              transition: "transform 0.3s",
              padding:"20px"
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div className="card-body">
              <h3 className="card-title" style={{ marginBottom: "20px", color: "#f7c08a" }}>{card.title}</h3>
              <p className="card-text" style={{ marginBottom: "20px" }}>{card.description}</p>
              <Link
                to={card.link}
                className="btn"
                style={{
                  backgroundColor: "#b3202e",
                  color: "#fff",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "1rem",
                  padding: "10px 20px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                  transition: "background-color 0.3s, box-shadow 0.3s",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#8c1c27";
                  e.target.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#b3202e";
                  e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5)";
                }}
              >
                Go to {card.title.split(" ")[0]}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <Link
          to="/supplierDetails"
          className="btn"
          style={{
            backgroundColor: "#b3202e",
            color: "#fff",
            padding: "12px 25px",
            borderRadius: "10px",
            textDecoration: "none",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
            transition: "background-color 0.3s, box-shadow 0.3s",
            fontSize: "1.2rem",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#8c1c27";
            e.target.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.6)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#b3202e";
            e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5)";
          }}
        >
          Supplier Details
        </Link>
      </div>
    </div>
  );
};

export default SupplierDashboard;
