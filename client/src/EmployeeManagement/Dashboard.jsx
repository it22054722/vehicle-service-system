import React from 'react';
import { Link } from 'react-router-dom';
import PackageHeader from './components/PackageHeader'; // Import the PackageHeader component


function Dashboard() {
  return (
    <div style={styles.background}>
      <PackageHeader /> {/* Add PackageHeader at the top */}

      <div style={styles.card}>
        <h2 style={styles.heading}>Employee Manager Dashboard</h2>

        {/* Horizontal aligned clickable images */}
        <div style={styles.imageContainer}>
          <Link to="/users">
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGVtcGxveWVlfGVufDB8fDB8fHww"
              alt="Go to Users"
              style={styles.iconImage}
              className="icon-image" // Added class name for event listeners
            />
            <div style={styles.label}>Employee Register</div>
          </Link>

          <Link to="/attendance">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdjg9Z1RQupDWChCyIhrTRafv-tvFb0m8itw&s"
              alt="Go to Attendance"
              style={styles.iconImage}
              className="icon-image" // Added class name for event listeners
            />
            <div style={styles.label}>Attendance</div>
          </Link>

          <Link to="/payments">
            <img
              src="https://images.squarespace-cdn.com/content/v1/58fbfecf725e25a3d1966494/1617226270371-JFRCRYD8LRFAB7XG7B04/image-asset.jpeg?format=500w"
              alt="Go to Payments"
              style={styles.iconImage}
              className="icon-image" // Added class name for event listeners
            />
            <div style={styles.label}>Payments</div>
          </Link>
        </div>
      </div>
     
    </div>
  );
}

const styles = {
  background: {
    display: 'flex',
    flexDirection: 'column', // Changed to column to fit header and footer
    justifyContent: 'center',
    alignItems: 'center',
    height: '120vh',
    backgroundImage: 'url("https://img.freepik.com/premium-photo/car-repair-maintenance-service-center-blurred-background_293060-2976.jpg")', // Add your background image URL
    backgroundSize: 'cover', // Make sure the image covers the entire background
    backgroundPosition: 'center', // Center the image
    backgroundRepeat: 'no-repeat', // Prevent repeating the background image
  },
  card: {
    padding: '30px',
    width: '1300px',
    borderRadius: '20px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    backgroundColor: 'rgba(232, 232, 232, 0.5)',
    textAlign: 'center',
  },
  heading: {
    fontSize: '30px',
    marginBottom: '30px',
    color: '#000000',
    fontWeight: 'bold',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  iconImage: {
    width: '300px',
    height: '500px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  label: {
    marginTop: '10px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#000000',
  },
};

export default Dashboard;
