// Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';



const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const navigate = useNavigate();

  const validateUsername = (username) => /^[A-Za-z\s]+$/.test(username);
  const validateEmail = (email) => /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.com$/.test(email);
  const validatePassword = (password) => password.length >= 5 && password.length <= 10;

  const handleUsernameChange = (e) => {
    const input = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setUsername(input);
    setUsernameError(!validateUsername(input) ? 'Username must only contain letters and spaces.' : '');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (usernameError || !validateEmail(email) || !validatePassword(password)) {
      Swal.fire('Error', 'Please fill in all fields correctly.', 'error');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8070/api/auth/register', {
        username,
        email,
        password,
        vehicleType,
      });
      Swal.fire('Success', 'Registration successful', 'success');
      navigate('/login');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Server error', 'error');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const response = await axios.post('http://localhost:8070/api/auth/register', {
        username: user.displayName,
        email: user.email,
        vehicleType,
      });
      Swal.fire('Success', 'Registration successful with Google', 'success');
      navigate('/login');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center min-vh-100" 
     
    >
      <div className="card shadow-lg p-4 w-100 border-0" style={{ maxWidth: '500px', borderRadius: '12px', backgroundColor: '#ffffff90' }}>
        <h2 className="text-center mb-4" style={{ color: '#8B0000', fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}>
          Create an Account
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label text-muted">Username</label>
            <input
              type="text"
              className="form-control border-danger rounded-pill"
              value={username}
              onChange={handleUsernameChange}
              required
              placeholder="Enter a username"
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            />
            {usernameError && <div className="text-danger">{usernameError}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Email</label>
            <input
              type="email"
              className="form-control border-danger rounded-pill"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@gmail.com"
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-danger rounded-pill"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="5-10 characters"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Vehicle Type</label>
            <select
              className="form-select border-danger rounded-pill"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              required
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="Suv">SUV</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-danger w-100 py-2 rounded-pill mb-3"
            style={{ backgroundColor: '#8B0000', borderColor: '#8B0000', fontWeight: 'bold' }}
          >
            Register
          </button>
        </form>
      
        <div className="text-center mt-3">
          <p className="text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-decoration-none" style={{ color: '#8B0000' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
