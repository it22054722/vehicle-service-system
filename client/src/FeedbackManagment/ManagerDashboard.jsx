import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const handleManageFeedback = () => {
    navigate('/Mangeview');
  };

  const handleViewSummary = () => {
    navigate('/pages/FeedbackSummery');
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#8B0000',
      color: 'white',
    },
    button: {
      margin: '10px',
      padding: '15px 30px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      color: 'white',
      backgroundColor: 'black',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#8B0000',
    },
  };

  return (
    <div style={styles.container}>
      <h1>Feedback Management Dashboard</h1>
      <button
        style={styles.button}
        onClick={handleManageFeedback}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#8B0000')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'black')}
      >
        Manage Feedback
      </button>
      <button
        style={styles.button}
        onClick={handleViewSummary}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#8B0000')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'black')}
      >
        View Summary
      </button>
    </div>
  );
};

export default ManagerDashboard;
