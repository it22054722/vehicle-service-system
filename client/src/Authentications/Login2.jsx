import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaSignInAlt } from 'react-icons/fa';

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
    <div className="login-background">
      <div className="card login-card shadow-lg p-4 w-100">
        <div className="text-center mb-4">
          <h1 className="title">Levaggio</h1>
          <h2 className="subtitle">Welcome Back</h2>
        </div>
        <form onSubmit={handleLogin}>
          {!isAdmin && (
            <>
              <div className="mb-3">
                <label className="form-label">📧 Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">🔒 Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
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
                <select
                  className="form-select"
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
              <div className="mb-3">
                <label className="form-label">🔑 Admin Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="btn w-100"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <>
                <FaSignInAlt /> Login
              </>
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
  .login-background {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #8B0000, #FFFFFF); /* Dark Red and White */
    animation: gradient-animation 5s ease infinite;
    background-size: 200% 200%;
  }

  @keyframes gradient-animation {
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
    100% { background-position: 0% 0%; }
  }

  .login-card {
    max-width: 400px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.7); /* Transparent white */
    border: 1px solid rgba(139, 0, 0, 0.5); /* Slightly transparent border */
    padding: 20px;
    margin: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .title {
    color: #b3202e;
    font-weight: bold;
    font-size: 2.5rem;
    letter-spacing: 2px;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  }

  .subtitle {
    color: #8B0000;
    font-weight: bold;
    font-size: 1.5rem;
    letter-spacing: 1px;
  }

  .form-control {
    border-radius: 30px;
    border: 2px solid #b3202e;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .form-control:focus {
    border-color: #8B0000;
    box-shadow: 0 0 8px rgba(139, 0, 0, 0.5);
  }

  .form-control:hover {
    border-color: #b3202e;
  }

  .btn {
    background-color: #8B0000;
    color: #fff;
    font-weight: bold;
    border-radius: 30px;
    padding: 10px;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }

  .btn:hover {
    background-color: #660000 !important;
    transform: scale(1.05);
  }
`}</style>




    </div>
  );
};

export default Login;