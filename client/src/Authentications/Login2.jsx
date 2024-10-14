import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock, FaUser, FaUserShield } from 'react-icons/fa';

const admins = [
  { name: 'System Operation Manager', password: 'pasindu', redirectTo: '/packagedsahboard' },
  { name: 'Supplier Manager', password: 'Dimuth', redirectTo: '/supplier/all' },
  { name: 'Employee Manager', password: 'paman', redirectTo: '/dashboard' },
  { name: 'Service Record Manager', password: 'akash', redirectTo: '/serviceDashboard' },
  { name: 'Trainee Cordinator', password: 'manthi', redirectTo: '/Tdashboard' },
  { name: 'Customer Affaire Manager', password: 'amanda', redirectTo: '/ManagerDashboard' },
  { name: 'Appoinment Manager', password: 'imal', redirectTo: '/AppTable' },
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
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card login-card shadow-lg p-4 w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          {!isAdmin && (
            <>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text"><FaEnvelope /></span>
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
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><FaLock /></span>
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
                <label className="form-label">Select Admin</label>
                <div className="input-group">
                  <span className="input-group-text"><FaUserShield /></span>
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
                <label className="form-label">Admin Password</label>
                <div className="input-group">
                  <span className="input-group-text"><FaLock /></span>
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
  style={{ backgroundColor: '#8B0000', color: '#fff' , fontWeight:"bold"}}
  disabled={loading}
>
  {loading ? (
    <span
      className="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
  ) : (
    'Login'
  )}
</button>

        </form>
      </div>
    </div>
  );
};

export default Login;
