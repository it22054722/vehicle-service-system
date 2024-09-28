import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaClipboardList, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import '../App.css'; // Import your CSS file

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic for logout if any
    navigate('/'); // Navigate to the login page
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center position-relative">
      <div className="w-75 rounded p-5 shadow-lg text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <h1 className="mb-5" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2.5rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', color: '#000' }}>
          Dashboard
        </h1>

        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card hover-card">
              <div className="card-body">
                {/* Button with dark red color and border */}
                <h5 className="card-title"><FaUserPlus /> Register Trainee</h5>
                <p className="card-text">Manage trainee registrations easily.</p>
                <button
                  className="btn w-100"
                  onClick={() => navigate('/trainee')}
                  style={{
                    backgroundColor: '#8B0000',
                    color: '#fff',
                    border: '2px solid #8B0000', // Dark red border
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#a20000')} // Slightly lighter red on hover
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#8B0000')} // Reset to original dark red
                >
                  Go to Registration
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card hover-card">
              <div className="card-body">
                {/* Button with dark red color and border */}
                <h5 className="card-title"><FaClipboardList /> Schedule Management</h5>
                <p className="card-text">View and manage trainee schedules.</p>
                <button
                  className="btn w-100"
                  onClick={() => navigate('/traineeschedule')}
                  style={{
                    backgroundColor: '#8B0000',
                    color: '#fff',
                    border: '2px solid #8B0000',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#a20000')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#8B0000')}
                >
                  Go to Schedule
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card hover-card">
              <div className="card-body">
                {/* Button with dark red color and border */}
                <h5 className="card-title"><FaChartLine /> Progress Management</h5>
                <p className="card-text">Track and manage trainee progress.</p>
                <button
                  className="btn w-100"
                  onClick={() => navigate('/traineeprogess')}
                  style={{
                    backgroundColor: '#8B0000',
                    color: '#fff',
                    border: '2px solid #8B0000',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#a20000')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#8B0000')}
                >
                  Go to Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button in the bottom corner */}
      <button
        className="logout-button"
        onClick={() => navigate('/traineelogin')}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgba(220, 53, 69, 0.7)', // Semi-transparent red
          color: '#fff',
          border: 'none',
          borderRadius: '40%',
          padding: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        <FaSignOutAlt style={{ transform: 'rotate(180deg)' }} /> {/* Rotate the icon 180 degrees to face left */}
      </button>
    </div>
  );
}

export default Dashboard;
