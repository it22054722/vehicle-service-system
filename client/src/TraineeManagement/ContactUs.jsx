import React from 'react';

function ContactUs() {
  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        padding: '50px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        marginTop:"50px"
      }}
    >
      <div
        style={{
          width: '80%',
          backgroundColor: '#fff',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '900px',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8B0000' }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#404040', marginBottom: '40px' }}>
          We’d love to hear from you! Whether you have a question about our services, pricing, or anything else, feel free to reach out.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '30px',
          }}
        >
          {/* Contact Information */}
          <div
            style={{
              flex: '1',
              minWidth: '250px',
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid #8B0000',
              color: '#333',
            }}
          >
            <h3 style={{ color: '#8B0000', fontWeight: 'bold', marginBottom: '20px' }}>
              Vehicle Service Station
            </h3>
            <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: '#8B0000' }}></i>
              Address:
            </p>
            <p style={{ marginBottom: '20px' }}>NO 234/A/1 Negombo road, Kurana</p>
            <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              <i className="fas fa-phone" style={{ marginRight: '10px', color: '#8B0000' }}></i>
              Phone:
            </p>
            <p style={{ marginBottom: '20px' }}>032 567-8900</p>
            <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              <i className="fas fa-envelope" style={{ marginRight: '10px', color: '#8B0000' }}></i>
              Email:
            </p>
            <p>info@lavaggiyo.com</p>

            {/* Google Map Section */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h3 style={{ color: "#8B0000", marginBottom: "15px" }}>
            Our Location:
          </h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31621.478453135167!2d79.8284300686073!3d7.208985137982586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f7916a96b705%3A0x7a60ef957c8a5b1!2sNegombo!5e0!3m2!1sen!2slk!4v1696840351232!5m2!1sen!2slk"
            width="100%"
            height="300"
            style={{ border: "0", borderRadius: "8px" }}
            allowFullScreen=""
            loading="lazy"
            title="Negombo Location"
          ></iframe>
        </div>

        {/* Footer Message */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <p style={{ color: "#8B0000", fontSize: "1rem", fontWeight: "bold" }}>
            We're always here to help with your vehicle needs.
          </p>
        </div>
          </div>

          {/* Contact Form */}
          <div
            style={{
              flex: '2',
              minWidth: '300px',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid #8B0000',
            }}
          >
            <form>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Your Name</label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Your Email</label>
                <input
                  type="email"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Your Message</label>
                <textarea
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#8B0000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginTop: '10px',
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '40px', color: '#777', fontSize: '0.9rem' }}>
          <p>Our team is available Monday to Friday, 9:00 AM - 5:00 PM.</p>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
