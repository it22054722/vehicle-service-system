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

  const validateUsername = (username) => {
    const usernameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
    return usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    // Ensure email starts with a letter, followed by letters, numbers, or specific special characters
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.com$/;
    return emailRegex.test(email);
};


  const validatePassword = (password) => {
    return password.length >= 5 && password.length <= 10;
  };

  const handleUsernameChange = (e) => {
    // Replace any non-letter or non-space characters with an empty string
    const input = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setUsername(input);

    // Validate the username as the user types
    if (!validateUsername(input)) {
      setUsernameError('Username must only contain letters and spaces.');
    } else {
      setUsernameError('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (usernameError) {
      Swal.fire('Error', 'Please fix the username error before submitting.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire('Error', 'Email must start with letters and end with @gmail.com.', 'error');
      return;
    }

    if (!validatePassword(password)) {
      Swal.fire('Error', 'Password must be between 5 and 10 characters.', 'error');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        username,
        email,
        password,
        vehicleType
      });
      Swal.fire('Success', 'Registration successful', 'success');
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Server error', 'error');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 w-100 border-0 rounded-3" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4 text-primary">Create an Account</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label text-muted">Username</label>
            <input
              type="text"
              className={`form-control border-primary ${usernameError ? 'is-invalid' : ''}`}
              value={username}
              onChange={handleUsernameChange}
              required
              placeholder="Enter a  username"
            />
            {usernameError && (
              <div className="invalid-feedback">
                {usernameError}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Email</label>
            <input
              type="email"
              className="form-control border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@gmail.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="5-10 characters"
              />
              
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Vehicle Type</label>
            <select
              className="form-select border-primary"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              required
            >
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="Suv">SUV</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
          >
            Register
          </button>
        </form>
        <div className="text-center mt-3">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-decoration-none text-primary">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
