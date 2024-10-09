import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from './assets/view-car-running-high-speed (2).jpg';

const PackageDashboard = () => {
  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        minHeight: "100vh",
        padding: "4rem",
        color: "#f0f0f0",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "3.5rem", marginTop: "30px", marginBottom: "3rem", textShadow: "3px 3px 8px rgba(0, 0, 0, 0.9)", color: "#ffc857" }}>
        Package Management Dashboard
      </h1>

      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        {/* Card Component */}
        {[
          { title: "All Packages", description: "View a list of all available packages.", link: "/view-packages" },
          { title: "All Users", description: "Manage users subscribed to packages.", link: "/users2" },
          { title: "Add Package", description: "Create a new service package.", link: "/add-package" },
          { title: "Update Package", description: "Modify existing packages.", link: "/update-package/:id" },
        ].map((card, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              width: "320px",
              borderRadius: "20px",
              padding: "25px",
              textAlign: "center",
              boxShadow: "0 8px 40px rgba(0, 0, 0, 0.6)",
              marginBottom: "30px",
              transition: "transform 0.3s",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={{ color: "#ffc857", fontSize: "1.7rem", marginBottom: "20px" }}>{card.title}</h3>
            <p style={{ fontSize: "1rem", marginBottom: "20px", color: "#f7f7f7" }}>{card.description}</p>
            <Link
              to={card.link}
              style={{
                backgroundColor: "#348aa7",
                color: "#fff",
                padding: "14px 30px",
                borderRadius: "10px",
                textDecoration: "none",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.6)",
                transition: "background-color 0.3s, box-shadow 0.3s",
                fontSize: "1rem",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#2b6b7f";
                e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.7)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#348aa7";
                e.target.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.6)";
              }}
            >
              Go to {card.title.split(" ")[0]}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageDashboard;
