// src/InventoryDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const InventoryDashboard = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ marginBottom: '40px', color: '#FFFFFF', textAlign: 'center' }}>Inventory Manager Dashboard</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <Card title="Inventory" link="/inventory" />
        <Card title="Add item" link="/inventorycreate" />
        <Card title="Low Inventory" link="/low-inventory" />
      </div>
    </div>
  );
};

// Card component to display each item
const Card = ({ title, link }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link 
      to={link} 
      style={{
        ...cardStyle,
        ...(isHovered ? hoverStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 style={{ color: '#8B0000', textAlign: 'center', margin: 0 }}>{title}</h2>
    </Link>
  );
};

// Card styles
const cardStyle = {
  padding: '20px',
  width: '200px',
  height: '150px',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.7)', // Reduced opacity for transparency
  transition: 'transform 0.3s, box-shadow 0.3s',
};

// Hover effect for cards
const hoverStyle = {
  transform: 'scale(1.1)', // Increased scale for a popup effect
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)', // Increased shadow for depth
};

export default InventoryDashboard;
