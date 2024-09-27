import { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for show/hide password
import backgroundImage from './assets/supercars.png';
 
function ServiceLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const navigate = useNavigate(); // Initialize useNavigate hook
 
  const validateForm = () => {
    // Check if email and password are provided
    if (!email || !password) {
      setErrorMessage('All fields are required');
      return false;
    }
 
    // Check if email contains @
    if (!email.includes('@')) {
      setErrorMessage('Invalid email. Email must contain @ symbol');
      return false;
    }
 
    // Check if password is a 4-digit number
    if (!/^\d{4}$/.test(password)) {
      setErrorMessage('Password does not match with username');
      return false;
    }
 
    // Clear any error messages if all validations pass
    setErrorMessage('');
    return true;
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    // Perform validation
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }
 
    // Check if the email and password match the predefined credentials
    if (email === 'akashdealwis@gmail.com' && password === '2002') {
      alert('Login successful'); // Show login successful message
      navigate('/dashboard'); // Navigate to /dashboard page
    } else {
      // Send a POST request to the backend if credentials don't match predefined ones
      fetch('http://localhost:3002/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data); // This will show the response from the backend in an alert box
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };
 
  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card p-4 shadow" style={{ width: '400px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <h1
          className="mb-5"
          style={{
            textAlign: "center",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            color: "#8B0000", // Change to dark red color
          }}
        >
          Sign-in
        </h1>
        <p className="text-center mt-1 small">
          Hello sir, sign-in to access the service operations.
        </p>
        <br />
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{fontWeight: "bold",}}>Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter Email"
              autoComplete='off'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3 position-relative"> {/* Make this container position relative */}
            <label htmlFor="password" className="form-label" style={{fontWeight: "bold",}}>Password</label>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle password visibility
              className="form-control"
              id="password"
              placeholder="Enter Password"
              autoComplete='off'
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Show/Hide password icon */}
            <span 
              onClick={() => setShowPassword(!showPassword)} // Toggle show/hide state
              style={{
                position: 'absolute',
                right: '10px',
                top: '38px', // Position the icon
                cursor: 'pointer',
                fontSize: '1.2rem', // Adjust icon size
                color: '#8B0000', // Dark red color
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle icon based on state */}
            </span>
          </div>
          <button
            type="submit"
            className="btn btn-success w-100"
            style={{
              backgroundColor: '#8B0000', // Dark red color
              border: 'none', // Remove border
              transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)'; // Add shadow on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'; // Remove shadow on leave
            }}
          >
            Log in
          </button>
        </form>
        <br />
        <button type="button" className="btn btn-light w-100">Create Account</button>
      </div>
    </div>
  );
}
 
export default ServiceLogin;
