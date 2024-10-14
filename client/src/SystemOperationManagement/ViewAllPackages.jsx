// ViewAllPackages.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faCar, faTools, faCogs, faTachometerAlt, 
  faOilCan, faBatteryHalf, faWrench, faGasPump, faKey, faTruck 
} from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard, faPaypal } from '@fortawesome/free-brands-svg-icons';
import './Pages/styles/ViewAllPackages.css';
import { Modal, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'; 

const ViewAllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  
  const navigate = useNavigate();

  const predefinedIcons = [
    faCar, faTools, faCogs, faTachometerAlt, faOilCan, 
    faBatteryHalf, faWrench, faGasPump, faKey, faTruck,
  ];

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [searchTerm, packages, sortOption, priceRange]);

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:3001/package/");
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      Swal.fire('Error!', 'Failed to fetch packages.', 'error');
    }
  };

  const filterPackages = () => {
    let filtered = packages.filter((pkg) =>
      pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered = filtered.filter((pkg) =>
      pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
    );

    if (sortOption === "max-price") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "min-price") {
      filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredPackages(filtered);
  };
  
  const notifyUnavailable = () => toast.error('This package cannot be booked at the moment.');
  const notifyBookingSuccess = () => toast.success('Package booked successfully!');

  const handleBookClick = (pkg) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please log in to book a package.',
        confirmButtonText: 'Login',
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    if (pkg.availability && pkg.maxCustomers > 0) {
      setSelectedPackage(pkg);
      setShowModal(true); // Open booking modal
    } else {
      notifyUnavailable(); // Show toast notification
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'This package cannot be booked at the moment.',
      }); // Show SweetAlert message
    }
    if (pkg.maxCustomers === 0) {
      Swal.fire({
          title: 'Oops!',
          text: 'All slots are finished!',
          icon: 'error',
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
      });
  } else if (pkg.maxCustomers === 1) {
      Swal.fire({
        title: 'Hurry up!',
        html: `<i class="fas fa-exclamation-triangle" style="color: orange;"></i> Only 1 slot available!`,
        icon: 'info',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
  } else {
      // Handle booking logic here (e.g., decrease maxCustomers)
      // This can be a function to update the state or make an API call.
  }








  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Reset payment form fields
    setCardNumber('');
    setCvv('');
    setExpiryDate('');
    setSelectedBank('');
    setSelectedDate(new Date());
  };

  const handleDateChange = (date) => {
    const today = new Date();
    if (date < today) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'Please select a future date.',
        confirmButtonColor: '#3085d6'
      });
    } else {
      setSelectedDate(date);
    }
  };

  const handleProceedToPayment = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Handle not logged in
        Swal.fire({
            icon: 'warning',
            title: 'Not Logged In',
            text: 'Please log in to proceed with payment.',
            confirmButtonText: 'Login',
        }).then(() => {
            navigate('/login');
        });
        return;
    }

    // Existing validations
    if (!cardNumber || !cvv || !expiryDate || !selectedBank) {
        Swal.fire('Validation Error', 'Please fill out all payment details.', 'warning');
        return;
    }

    // CVV should be exactly 3 digits
    if (!/^\d{3}$/.test(cvv)) {
        Swal.fire('Validation Error', 'Invalid CVV number.', 'warning');
        return;
    }

    // Validate card number and expiry date
    if (cardNumber.replace(/\s+/g, '').length !== 16) {
        Swal.fire('Validation Error', 'Invalid card number.', 'warning');
        return;
    }

    const today = new Date();
    const [expiryMonth, expiryYear] = expiryDate.split('/');
    if (
        !expiryMonth ||
        !expiryYear ||
        expiryMonth < 1 ||
        expiryMonth > 12 ||
        parseInt(expiryYear) < parseInt(today.getFullYear().toString().slice(-2))
    ) {
        Swal.fire('Validation Error', 'Please enter a valid expiry date.', 'warning');
        return;
    }

    try {
        const userId = getUserIdFromToken(token);
        if (!userId) {
            Swal.fire('Error', 'Invalid token. Please log in again.', 'error');
            navigate('/login');
            return;
        }

        // Calculate discount and total payment
        const originalPrice = selectedPackage.price;
        const discount = selectedPackage.discount || 0; // Assuming it's in percentage
        const discountAmount = (originalPrice * discount) / 100; // Calculate discount amount
        const totalPrice = originalPrice - discountAmount; // Total price after discount

        const bookingData = {
            packageId: selectedPackage._id,
            selectedDate: selectedDate.toISOString(),
            payment: {
                amount: totalPrice, // Use total price after discount
                paymentMethod: selectedBank,
                cardNumber: cardNumber.replace(/\s+/g, ''),
                cvv: cvv,
                expiryDate: expiryDate,
                receiptId: generateReceiptId(), // Function to generate a unique receipt ID
            },
        };

        // Update maxCustomers by decreasing it by 1
        const updatedMaxCustomers = selectedPackage.maxCustomers - 1;
        const updatedAvailability = updatedMaxCustomers > 0;

        // API call to update the package's maxCustomers and availability
        await axios.put(`http://localhost:3001/package/update/${selectedPackage._id}`, {
            maxCustomers: updatedMaxCustomers,
            availability: updatedAvailability,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Update the package in the local state
        setPackages(prevPackages => prevPackages.map(pkg =>
            pkg._id === selectedPackage._id
                ? { ...pkg, maxCustomers: updatedMaxCustomers, availability: updatedAvailability }
                : pkg
        ));

        // Generate receipt data object
        const receiptData = {
            receiptId: bookingData.payment.receiptId,
            packageName: selectedPackage.packageName,
            originalPrice: originalPrice.toFixed(2),
            discount: discount,
            discountAmount: discountAmount.toFixed(2),
            totalPrice: totalPrice.toFixed(2),
            bookingDate: selectedDate.toLocaleDateString(),
            paymentMethod: selectedBank,
          
        };
        

      



        // Save receipt data to local storage
        const existingReceipts = JSON.parse(localStorage.getItem('receipts')) || [];
        existingReceipts.push(receiptData);
        localStorage.setItem('receipts', JSON.stringify(existingReceipts));

        // Generate the receipt element
        const receiptElement = document.createElement('div');
        receiptElement.style.padding = '20px';
        receiptElement.style.border = '1px solid #4CAF50'; // Green border for a fresh look
        receiptElement.style.width = '300px';
        receiptElement.style.backgroundColor = '#f9f9f9'; // Light background color
        receiptElement.style.borderRadius = '10px'; // Rounded corners
        receiptElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Subtle shadow for depth
        receiptElement.style.fontFamily = 'Arial, sans-serif'; // Clean font
        receiptElement.style.color = '#333'; // Dark text for readability

        receiptElement.innerHTML = `
            <h4 style="text-align: left; color: #007BFF;">Levaggio</h4>
            <h2 style="text-align: center; color: #4CAF50;">Receipt</h2>
            <hr style="border: 1px solid #4CAF50;">
            <p><strong style="color: #555;">Package Name:</strong> <span style="color: #000;">${selectedPackage.packageName}</span></p>
            <p><strong style="color: #555;">Original Price:</strong> <span style="color: #000;">$${originalPrice.toFixed(2)}</span></p>
            <p><strong style="color: #555;">Discount:</strong> <span style="color: #D32F2F;">${discount}% (-$${discountAmount.toFixed(2)})</span></p>
            <p><strong style="color: #555;">Total Price:</strong> <span style="color: #4CAF50;">$${totalPrice.toFixed(2)}</span></p>
            <p><strong style="color: #555;">Date of Booking:</strong> <span style="color: #000;">${selectedDate.toLocaleDateString()}</span></p>
            <p><strong style="color: #555;">Payment Method:</strong> <span style="color: #000;">${selectedBank}</span></p>
            <p><strong style="color: #555;">Receipt ID:</strong> <span style="color: #000;">${bookingData.payment.receiptId}</span></p>
            <hr style="border: 1px solid #4CAF50;">
            <p style="text-align: center; color: #777;">Thank you for your booking!</p>
        `;

        document.body.appendChild(receiptElement);

        // Use html2canvas to capture the receipt
        await html2canvas(receiptElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save(`receipt_${bookingData.payment.receiptId}.pdf`);
        });

        // Clean up the receipt element
        document.body.removeChild(receiptElement);

        notifyBookingSuccess();

        Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: `Your payment of $${totalPrice.toFixed(2)} has been processed successfully. An e-receipt has been downloaded.`,
        }).then(() => {
            handleCloseModal();
            navigate('/'); // Navigate to the receipt table page
        });
    } catch (error) {
        console.error("Error processing payment and booking:", error);
        Swal.fire('Error!', error.response ? error.response.data.message : 'An error occurred during payment.', 'error');
    }
};

 
 
  // Helper function to extract userId from JWT token
  const getUserIdFromToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Helper function to generate a unique receipt ID
  const generateReceiptId = () => {
    return 'RCPT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').replace(/(.{2})(.{2})/, '$1/$2');
    setExpiryDate(value);
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      
      <div className="text-center mb-5">
  <h3 style={{ marginTop: '90px', color: '#FFFFFF' }}>All Packages</h3>

  {/* Search Bar, Sort By, and Price Range */}
  <div className="row align-items-center justify-content-center mb-4" style={{ gap: '20px', marginTop: '15px' }}>
    {/* Search Bar */}
    <div className="col-md-3" style={{ maxWidth: '320px', marginTop: '15px' }}>
      <div className="input-group" style={{ position: 'relative', width: '100%' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search packages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            borderRadius: '30px',
            border: '2px solid #FF5733', // Bold coral border
            paddingRight: '50px',
            paddingLeft: '20px',
            background: 'linear-gradient(135deg, rgba(255, 218, 185, 0.9), rgba(255, 160, 122, 0.8))', // Gradient with soft peach to coral
            color: '#C70039', // Deep red text color
            fontWeight: '600',
            height: '50px',
            boxShadow: '0 6px 15px rgba(255, 87, 51, 0.6)', // Bright coral shadow
            transition: 'all 0.3s ease-in-out',
          }}
        />
        <FontAwesomeIcon
          icon={faSearch}
          style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#FF5733',
            fontSize: '22px',
          }}
        />
      </div>
    </div>

    {/* Sort By Dropdown */}
    <div className="col-md-3" style={{ maxWidth: '320px' }}>
      <select
        className="form-select"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        style={{
          borderRadius: '30px',
          border: '2px solid #33FF57', // Vivid green border
          background: 'linear-gradient(135deg, rgba(144, 238, 144, 0.8), rgba(102, 205, 170, 0.8))', // Gradient light green to aqua
          color: '#1E8449', // Deep green text color
          fontWeight: '600',
          padding: '10px 15px',
          height: '50px',
          fontSize: '16px',
          boxShadow: '0 6px 15px rgba(51, 255, 87, 0.5)', // Bright green shadow
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <option value="default" style={{ color: '#666' }}>Sort By</option>
        <option value="max-price">Max Price First</option>
        <option value="min-price">Min Price First</option>
      </select>
    </div>

    {/* Price Range Dropdown */}
    <div className="col-md-3" style={{ maxWidth: '320px' }}>
      <select
        className="form-select"
        value={priceRange.join(',')}
        onChange={(e) => setPriceRange(e.target.value.split(',').map(Number))}
        style={{
          borderRadius: '30px',
          border: '2px solid #33C1FF', // Bright blue border
          background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.8), rgba(135, 206, 250, 0.8))', // Gradient light blue to sky blue
          color: '#0A74DA', // Deep blue text color
          fontWeight: '600',
          padding: '10px 15px',
          height: '50px',
          fontSize: '16px',
          boxShadow: '0 6px 15px rgba(51, 193, 255, 0.5)', // Bright blue shadow
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <option value="0,10" style={{ color: '#666' }}>Price Range: $0 - $10</option>
        <option value="10,100">Price Range: $10 - $100</option>
        <option value="100,500">Price Range: $100 - $500</option>
        <option value="500,1000">Price Range: $500 - $1000</option>
        <option value="1000,1500">Price Range: $1000 - $5000</option>
      </select>
    </div>
  </div>
</div>


      <div className="scrollable-container">
        <div className="row">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg, index) => (
              <div key={pkg._id} className="col-md-4 mb-4">
                <div className="card rounded-3 shadow-sm package-card">
                  <div className="icon-content-container text-center py-4">
                    <div className="icon-container">
                      <FontAwesomeIcon icon={predefinedIcons[index % predefinedIcons.length]} size="3x" />
                    </div>
                    <hr className="separator-line" />
                  </div>

                  <div className="card-body">
                    <h5 className="card-title">{pkg.packageName}</h5>
                    <p className="card-text">
                      <i className="bi bi-cash me-1"></i><strong>Price:</strong> ${pkg.price}<br />
                      <i className="bi bi-tags me-1"></i><strong>Category:</strong> {pkg.category}<br />
                      <i className="bi bi-clock me-1"></i><strong>Duration:</strong> {pkg.duration} hours<br />
                      <span className="highlight">
                        <i className="bi bi-percent me-1"></i><strong>Discount:</strong> {pkg.discount}% 
                      </span><br />
                      <i className="bi bi-check-circle me-1"></i><strong>Availability:</strong> {pkg.availability ? 'Available' : 'Not Available'}<br />

                      <i className="bi bi-people me-1"></i><strong>Max Customers:</strong> {pkg.maxCustomers} {/* Added this line */}
                      
                    </p>
                    <div className="text-center">
                      <Link to={`/view-package/${pkg._id}`} className="btn btn-primary me-2">
                        <i className="bi bi-eye me-1"></i> View 
                      </Link>
                      <button 
                        onClick={() => handleBookClick(pkg)} 
                        className="btn btn-primary me-2"
                        disabled={ pkg.maxCustomers === 0}
                        style={{
                          backgroundColor: "green",
                          borderColor: "green",
                        }}
                      >
                        <i className="bi bi-calendar-plus me-1"></i> Book
                      </button>
                      {/* Display "All slots are finished" if no slots left */}
                      { pkg.maxCustomers === 0 ? (
                        <div className="mt-2 text-danger">All slots are finished</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <p>No results found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Package Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPackage && (
            <div>
              <h5>{selectedPackage.packageName}</h5>
              <p><strong>Price:</strong> ${selectedPackage.price}</p>
              <div className="payment-form">
                <h6>Payment Details</h6>

                <div className="form-group mt-3">
                  <label>Select Payment Method:</label>
                  <div className="card-type-icons d-flex justify-content-around">
                    <div className="card-type text-center">
                      <FontAwesomeIcon icon={faCcVisa} size="2x" />
                      <span className="card-type-label">Visa</span>
                    </div>
                    <div className="card-type text-center">
                      <FontAwesomeIcon icon={faCcMastercard} size="2x" />
                      <span className="card-type-label">MasterCard</span>
                    </div>
                    <div className="card-type text-center">
                      <FontAwesomeIcon icon={faPaypal} size="2x" />
                      <span className="card-type-label">PayPal</span>
                    </div>
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label>Select Bank:</label>
                  <div className="bank-dropdown-container">
                    <div className="bank-icons d-flex justify-content-around mb-2">
                      <div className="bank-icon text-center">
                        <i className="fas fa-building fa-2x"></i>
                        <span>Sampath Bank</span>
                      </div>
                      <div className="bank-icon text-center">
                        <i className="fas fa-university fa-2x"></i>
                        <span>Commercial Bank</span>
                      </div>
                      <div className="bank-icon text-center">
                        <i className="fas fa-university fa-2x"></i>
                        <span>BOC</span>
                      </div>
                      <div className="bank-icon text-center">
                        <i className="fas fa-university fa-2x"></i>
                        <span>People's Bank</span>
                      </div>
                    </div>
                    <select
                      className="form-select bank-dropdown"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="">Select a bank</option>
                      <option value="Sampath Bank">Sampath Bank</option>
                      <option value="Commercial Bank">Commercial Bank</option>
                      <option value="BOC">BOC</option>
                      <option value="People's Bank">People's Bank</option>
                    </select>
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label>Enter Card Number:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="xxxx xxxx xxxx xxxx"
                    maxLength="19"  // 16 digits + spaces
                  />
                </div>
                <div className="form-group mt-3">
                  <label>CVV:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Remove any non-numeric characters
                      setCvv(value);
                    }}
                    placeholder="xxx"
                    maxLength="3"  // Maximum 3 digits
                  />
                </div>

                <div className="form-group mt-3">
                  <label>Expiry Date (MM/YY):</label>
                  <input
                    type="text"
                    className="form-control"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Appointment Date:</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                    className="form-control"
                    minDate={new Date()}
                  />
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}  style={{ width: 'auto', padding: '5px 10px' }}>
            Close
          </Button>

          <Button 
  variant="primary" 
  onClick={handleProceedToPayment}
  style={{
    width: '40%', // Adjust width as needed
    padding: '10px 20px', // Increase padding for a more comfortable look
    fontSize: '16px', // Larger font for better readability
    borderRadius: '8px', // Rounded corners for a softer look
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    backgroundColor: '#007bff', // Customize color if needed
    border: 'none'
  }}
>
  Proceed to Payment
</Button>




        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewAllPackages;
