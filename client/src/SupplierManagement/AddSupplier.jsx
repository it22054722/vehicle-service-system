import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import '../SystemOperationManagement/Pages/styles/AddSupplier.css';  // CSS file for additional styling
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function AddSupplier() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [supplierName, setSupplierName] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [partsRequired, setPartsRequired] = useState("");
    const [quantity, setQuantity] = useState("");
    const [additionalNote, setAdditionalNote] = useState("");

    const [supplierNameError, setSupplierNameError] = useState("");
    const [contactPersonError, setContactPersonError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [quantityError, setQuantityError] = useState("");

    // Validation: Only allow letters and spaces for supplier name
    const handleSupplierNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setSupplierName(value);
        if (!value) setSupplierNameError('Supplier name is required.');
        else setSupplierNameError('');
    };

    // Validation: Only allow letters and spaces for contact person
    const handleContactPersonChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setContactPerson(value);
        if (!value) setContactPersonError('Contact person is required.');
        else setContactPersonError('');
    };

    // Validation: Phone number should be numeric and have exactly 10 digits
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length !== 10) {
            setPhoneNumberError("Phone number must have exactly 10 digits.");
        } else {
            setPhoneNumberError("");
        }
        setPhoneNumber(value);
    };

    // Validation: Quantity should be greater than 0
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value <= 0) {
            setQuantityError("Quantity must be greater than zero.");
        } else {
            setQuantityError("");
        }
        setQuantity(e.target.value);
    };

    // Submit function
    function sendData(e) {
        e.preventDefault();

        // Check for validation errors
        if (supplierNameError || contactPersonError || phoneNumberError || quantityError) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Please correct the errors before submitting.',
                confirmButtonText: 'OK'
            });
            return; // Prevent submission if validation fails
        }

        const newSupplier = {
            supplierName,
            contactPerson,
            phoneNumber,
            address,
            partsRequired,
            quantity: parseInt(quantity, 10),
            additionalNote,
        };

        axios.post("http://localhost:3001/supplier/add", newSupplier)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    text: 'The supplier has been added successfully!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate("/supplier/all"); // Redirect to All Suppliers page
                });

                // Reset form fields after successful submission
                setSupplierName("");
                setContactPerson("");
                setPhoneNumber("");
                setAddress("");
                setPartsRequired("");
                setQuantity("");
                setAdditionalNote("");
            })
            .catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'An error occurred: ' + err.message,
                    confirmButtonText: 'OK'
                });
            });
    }

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 mt-5">
            <div className="row w-100">
                <div className="col-md-8 col-lg-6 mx-auto">
                    <div className="card border-5 shadow rounded-4 bg-light bg-opacity-75">
                        <div className="card-body p-4">
                            <h3 className="text-center mb-4 position-relative">
                                <i className="bi bi-plus-circle icon-color me-2"></i>Add New Supplier
                                <div className="title-underline"></div>
                            </h3>

                            <form onSubmit={sendData}>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="supplierName" className="form-label">
                                            <i className="bi bi-shop icon-color me-2"></i>Supplier Name
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="supplierName" 
                                            placeholder="Enter Supplier Name"
                                            value={supplierName}
                                            onChange={handleSupplierNameChange} 
                                            required
                                        />
                                        {supplierNameError && (
                                            <div className="text-danger mt-1">{supplierNameError}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="contactPerson" className="form-label">
                                            <i className="bi bi-person icon-color me-2"></i>Contact Person
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="contactPerson" 
                                            placeholder="Enter Contact Person"
                                            value={contactPerson}
                                            onChange={handleContactPersonChange} 
                                            required
                                        />
                                        {contactPersonError && (
                                            <div className="text-danger mt-1">{contactPersonError}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="phoneNumber" className="form-label">
                                            <i className="bi bi-telephone icon-color me-2"></i>Phone Number
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="phoneNumber" 
                                            placeholder="Enter Phone Number"
                                            value={phoneNumber}
                                            onChange={handlePhoneNumberChange} 
                                            required
                                        />
                                        {phoneNumberError && (
                                            <div className="text-danger mt-1">{phoneNumberError}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="address" className="form-label">
                                            <i className="bi bi-geo-alt icon-color me-2"></i>Address
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="address" 
                                            placeholder="Enter Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="partsRequired" className="form-label">
                                            <i className="bi bi-tools icon-color me-2"></i>Parts Required
                                        </label>
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-secondary dropdown-toggle form-control"
                                                type="button"
                                                id="dropdownParts"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {partsRequired || 'Select Part'} {/* Show the selected part or default text */}
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownParts">
                                                <li><button className="dropdown-item" onClick={() => setPartsRequired('Engine')}><i className="bi bi-gear-fill me-2"></i>Engine</button></li>
                                                <li><button className="dropdown-item" onClick={() => setPartsRequired('Transmission')}><i className="bi bi-speedometer2 me-2"></i>Transmission</button></li>
                                                <li><button className="dropdown-item" onClick={() => setPartsRequired('Brakes')}><i className="bi bi-stoplights me-2"></i>Brakes</button></li>
                                                <li><button className="dropdown-item" onClick={() => setPartsRequired('Suspension')}><i className="bi bi-car-front-fill me-2"></i>Suspension</button></li>
                                                <li><button className="dropdown-item" onClick={() => setPartsRequired('Tires')}><i className="bi bi-circle-half me-2"></i>Tires</button></li>
                                                <li><button className="dropdown-item" onClick={() => setPartsRequired('Battery')}><i className="bi bi-battery-full me-2"></i>Battery</button></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="quantity" className="form-label">
                                            <i className="bi bi-hash icon-color me-2"></i>Quantity
                                        </label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="quantity" 
                                            placeholder="Enter Quantity"
                                            value={quantity}
                                            onChange={handleQuantityChange} 
                                            required
                                        />
                                        {quantityError && (
                                            <div className="text-danger mt-1">{quantityError}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="additionalNote" className="form-label">
                                        <i className="bi bi-file-earmark-text icon-color me-2"></i>Additional Notes
                                    </label>
                                    <textarea 
                                        className="form-control" 
                                        id="additionalNote" 
                                        rows="3"
                                        value={additionalNote}
                                        onChange={(e) => setAdditionalNote(e.target.value)}
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    <i className="bi bi-plus-circle me-2"></i>Add Supplier
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
