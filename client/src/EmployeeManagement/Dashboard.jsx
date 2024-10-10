import React from 'react';
import { Link } from 'react-router-dom';
import PackageHeader from './components/PackageHeader'; // Import the PackageHeader component

function Dashboard() {
  return (
    <div style={styles.background}>
      <div style={styles.overlay}></div> {/* Overlay for readability */}
      <PackageHeader /> {/* Add PackageHeader at the top */}

      <div style={styles.card}>
        <h2 style={styles.heading}>Employee Manager Dashboard</h2>

        {/* Horizontal aligned clickable images */}
        <div style={styles.imageContainer}>
          <Link to="/users" style={styles.link}>
            <div style={styles.cardItem}>
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGVtcGxveWVlfGVufDB8fDB8fHww"
                alt="Go to Users"
                style={styles.iconImage}
                className="icon-image"
              />
              <div style={styles.label}>Employee Register</div>
            </div>
          </Link>

          <Link to="/attendance" style={styles.link}>
            <div style={styles.cardItem}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdjg9Z1RQupDWChCyIhrTRafv-tvFb0m8itw&s"
                alt="Go to Attendance"
                style={styles.iconImage}
                className="icon-image"
              />
              <div style={styles.label}>Attendance</div>
            </div>
          </Link>

          <Link to="/payments" style={styles.link}>
            <div style={styles.cardItem}>
              <img
                src="https://images.squarespace-cdn.com/content/v1/58fbfecf725e25a3d1966494/1617226270371-JFRCRYD8LRFAB7XG7B04/image-asset.jpeg?format=500w"
                alt="Go to Payments"
                style={styles.iconImage}
                className="icon-image"
              />
              <div style={styles.label}>Payments</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  background: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'url("https://img.freepik.com/premium-photo/car-repair-maintenance-service-center-blurred-background_293060-2976.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  card: {
    zIndex: 2,
    padding: '30px',
    width: '90%',
    maxWidth: '1200px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)', // Glassmorphism effect
    textAlign: 'center',
  },
  heading: {
    fontSize: '36px',
    marginBottom: '30px',
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Roboto, sans-serif',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  cardItem: {
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  iconImage: {
    width: '250px',
    height: '400px',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    transition: 'transform 0.4s, box-shadow 0.4s',
  },
  iconImageHover: {
    transform: 'scale(1.05)', // Scale up on hover
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },
  label: {
    marginTop: '15px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
  },
  link: {
    textDecoration: 'none',
  },
};

export default Dashboard;
