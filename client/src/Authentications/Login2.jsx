import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaSignInAlt } from 'react-icons/fa';
import carImage from '../systemoperationmanagement/assets/levaggio.png';
import backgroundImage from '../systemoperationmanagement/assets/bg4.jpg'; // New background image

const admins = [
  { name: 'System Operation Manager', password: 'pasindu', redirectTo: '/packageDashboard' },
  { name: 'Supplier Manager', password: 'Dimuth', redirectTo: '/sdashboard' },
  { name: 'Employee Manager', password: 'paman', redirectTo: '/dashboard' },
  { name: 'Service Record Manager', password: 'akash', redirectTo: '/serviceDashboard' },
  { name: 'Trainee Coordinator', password: 'manthi', redirectTo: '/Tdashboard' },
  { name: 'Customer Affairs Manager', password: 'amanda', redirectTo: '/ManagerDashboard' },
  { name: 'Appointment Manager', password: 'imal', redirectTo: '/AppTable' },
  { name: 'Inventory Manager', password: 'lashan', redirectTo: '/inventoryDashboard' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isAdmin) {
      const admin = admins.find(admin => admin.name === selectedAdmin);
      if (admin) {
        if (password !== admin.password) {
          Swal.fire('Error', 'Incorrect admin password', 'error');
          setLoading(false);
          return;
        }
        navigate(admin.redirectTo);
        setLoading(false);
        return;
      } else {
        Swal.fire('Error', 'Please select an admin', 'error');
        setLoading(false);
        return;
      }
    } else {
      try {
        const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
        const { token, userId } = response.data;

        localStorage.setItem('authToken', token); // Store auth token
        Swal.fire('Success', 'Login successful', 'success');

        // Redirect to user profile with the userId
        navigate(`/profile/${userId}`);
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Server error', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="card shadow-lg p-4 w-100 border-0"
        style={{
          maxWidth: '400px',  // Minimized width
          borderRadius: '12px',
          backgroundColor: '#ffffff90',
          transition: 'transform 0.3s ease',
          overflow: 'hidden', // Ensure no scroll bars
          marginTop: '90px'
        }}
      >
        <div className="text-center mb-4">
          <img src={carImage} alt="Levaggio" style={{ width: '120px', borderRadius: '50%' }} />
          <h1 style={{ color: '#8B0000', fontWeight: 'bold', fontSize: '2.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Levaggio</h1>
          <h2 className="mb-4" style={{ color: '#8B0000', fontWeight: 'bold' }}>Welcome Back</h2>
        </div>
        <form onSubmit={handleLogin}>
          {!isAdmin && (
            <>
              <div className="mb-3">
                <label className="form-label">📧 Email</label>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control rounded-pill"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">🔒 Password</label>
                <div className="input-group">
                  <input
                    type="password"
                    className="form-control rounded-pill"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </>
          )}
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isAdmin"
              checked={isAdmin}
              onChange={() => {
                setIsAdmin(!isAdmin);
                setSelectedAdmin('');
                setEmail('');
                setPassword('');
              }}
            />
            <label className="form-check-label" htmlFor="isAdmin">Login as Admin</label>
          </div>
          {isAdmin && (
            <>
              <div className="mb-3">
                <label className="form-label">👤 Select Admin</label>
                <div className="input-group">
                  <select
                    className="form-select rounded-pill"
                    value={selectedAdmin}
                    onChange={(e) => setSelectedAdmin(e.target.value)}
                    required
                  >
                    <option value="">Select an admin...</option>
                    {admins.map((admin, index) => (
                      <option key={index} value={admin.name}>{admin.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">🔑 Admin Password</label>
                <div className="input-group">
                  <input
                    type="password"
                    className="form-control rounded-pill"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                  />
                </div>
              </div>
            </>
          )}
          <button
            type="submit"
            className="btn w-100 rounded-pill"
            style={{ backgroundColor: '#8B0000', color: '#fff', fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <>
                <FaSignInAlt /> Login
              </>
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-card:hover {
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
        }

        .btn:hover {
          background-color: #660000 !important;
        }

        .form-control:focus {
          box-shadow: none;
        }

        .form-control:hover {
          border-color: #8B0000;
        }
      `}</style>
    </div>
  );
};

export default Login;
