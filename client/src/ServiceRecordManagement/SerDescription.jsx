import React, { useState } from 'react';
import backgroundImage from './assets/supercars.png'; // Ensure the correct path to the image

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { title: 'Oil Change', description: 'Replacing engine oil and oil filter to ensure smooth engine operation.' },
    { title: 'Fluid Checks and Replacement', description: 'Checking and topping up or replacing fluids like coolant, brake fluid, and more.' },
    { title: 'Tire Services', description: 'Tire rotation, balancing, alignment, and replacement.' },
    { title: 'Battery Services', description: 'Battery inspection, testing, charging, or replacement.' },
    { title: 'Brake Services', description: 'Inspection, repair, or replacement of brake pads, rotors, and brake fluid.' },
    { title: 'Engine Repairs', description: 'Repairing or replacing parts such as spark plugs, belts, gaskets, etc.' },
    { title: 'Transmission Services', description: 'Inspection, repair, or replacement of the transmission system.' },
    { title: 'Suspension and Steering Repair', description: 'Fixing issues related to shocks, struts, control arms, and more.' },
    { title: 'Exhaust System Repair', description: 'Fixing or replacing exhaust pipes, mufflers, and catalytic converters.' },
    { title: 'Diagnostic Checks', description: 'Using diagnostic tools to check for problems in the vehicle’s electrical systems.' },
    { title: 'Electrical Repairs', description: 'Fixing or replacing components like alternators, starters, wiring, and lighting.' },
    { title: 'Air Conditioning/Heating Repair', description: 'Repairing issues related to HVAC systems.' },
    { title: 'Engine Diagnostics', description: 'Checking engine performance and diagnosing problems using computerized tools.' },
    { title: 'Emission Testing', description: 'Ensuring the vehicle meets environmental regulations for emissions.' },
    { title: 'Engine Tuning', description: 'Adjusting engine components for optimal performance and fuel efficiency.' },
    { title: 'Bodywork', description: 'Repairing dents, scratches, or damage to the vehicle body.' },
    { title: 'Windshield/Glass Repair', description: 'Fixing or replacing broken or damaged windows or windshields.' },
    { title: 'Paint Services', description: 'Repainting or touch-up services for the car’s exterior.' },
    { title: 'Tire Installation', description: 'Installing new tires or repairing existing ones.' },
    { title: 'Wheel Alignment and Balancing', description: 'Ensuring proper wheel alignment and balance for safety and performance.' },
    { title: 'Tire Pressure Monitoring System (TPMS)', description: 'Inspecting and repairing the TPMS.' },
    { title: 'State Inspections', description: 'Conducting mandatory state inspections for roadworthiness.' },
    { title: 'Pre-purchase Inspections', description: 'Inspecting used vehicles for buyers to assess condition before purchase.' },
    { title: 'Safety Checks', description: 'Checking lights, wipers, seat belts, mirrors, and other safety equipment.' },
    { title: 'Hybrid/Electric Vehicle Services', description: 'Maintenance and repair for hybrid or electric cars.' },
    { title: 'Performance Modifications', description: 'Upgrading vehicles with custom exhausts, suspension kits, or other performance enhancements.' },
    { title: 'Fleet Services', description: 'Maintenance and repair services for business-owned fleets of vehicles.' },
  ];

  const handleClick = (service) => {
    setSelectedService(service);
  };

  return (
    <div style={{
      padding: '2rem',
      fontFamily: "'Poppins', sans-serif",
      color: '#333',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      backgroundAttachment: 'fixed',
    }}>
      <h2 style={{
        textAlign: 'center',
        marginTop: '45px',
        color: '#ffffff',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
      }}>
        Vehicle Services
      </h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1.5rem',
        marginTop: '1.5rem',
      }}>
        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => handleClick(service)}
            style={{
              width: '220px',
              padding: '1.5rem',
              borderRadius: '15px',
              background: 'linear-gradient(145deg, #ffffff, #f9f9f9)',
              boxShadow: '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              color: '#b3202e',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(8px)', // Adds a subtle background blur
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff';
            }}
          >
            <h3 style={{
              fontSize: '1.5rem',
              margin: '0 0 0.5rem 0',
              fontWeight: 'bold',
              color: '#b3202e',
              textShadow: '1px 1px 3px rgba(255, 255, 255, 0.7)', // Adds depth to the title
            }}>
              {service.title}
            </h3>
            <p style={{
              fontSize: '1rem',
              margin: '0',
              color: '#555',
              maxHeight: '60px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}>
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {selectedService && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            borderRadius: '12px',
            backgroundColor: '#fff5f5',
            color: '#b3202e',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            margin: '2rem auto',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{selectedService.title}</h3>
          <p style={{ fontSize: '1.1rem' }}>{selectedService.description}</p>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
