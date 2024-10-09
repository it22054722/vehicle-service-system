import React, { useState } from "react";
// index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // For icons
import 'bootstrap-icons/font/bootstrap-icons.css';


import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Image,
  Card,
} from "react-bootstrap";

export default function AddFeedback() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [validation, setValidation] = useState({});
  const navigate = useNavigate();

  // Handle change for all fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    validateField(e.target.id, e.target.value.trim());
  };

  // Validation function for individual fields
  const validateField = (field, value) => {
    let errors = { ...validation };

    // Name validation (not empty and no numbers)
    if (field === "name") {
      const namePattern = /^[a-zA-Z\s]+$/; // Only allows letters and spaces
      if (value === "") {
        errors.name = "Name is required";
      } else if (!namePattern.test(value)) {
        errors.name = "Name cannot contain numbers or special characters";
      } else {
        errors.name = null;
      }
    }

    // Rating validation (should be selected)
    if (field === "rating") {
      errors.rating = value === "" ? "Rating is required" : null;
    }

    // Email validation (basic email pattern)
    if (field === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      errors.email =
        value === ""
          ? "Email is required"
          : !emailPattern.test(value)
          ? "Invalid email format"
          : null;
    }

    // Vehicle ID validation (must be 2-3 letters followed by up to 4 numbers)
    if (field === "vehicalid") {
      const vehicleIdPattern = /^[A-Za-z]{2,3}[0-9]{1,4}$/;
      errors.vehicalid =
        value === ""
          ? "Vehicle ID is required"
          : !vehicleIdPattern.test(value)
          ? "Vehicle ID must be 2-3 letters followed by up to 4 digits"
          : null;
    }

    // Phone validation (must start with 0 and be exactly 10 digits)
    if (field === "phone") {
      const phonePattern = /^0[0-9]{9}$/;
      errors.phone =
        value === ""
          ? "Phone number is required"
          : !phonePattern.test(value)
          ? "Phone number must start with 0 and be exactly 10 digits"
          : null;
    }

    // Description validation (not empty)
    if (field === "descrip") {
      errors.descrip = value === "" ? "Description is required" : null;
    }

    setValidation(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for any validation errors before submitting
    const hasErrors = Object.values(validation).some((err) => err !== null);
    if (hasErrors) {
      alert("Please fix the validation errors before submitting.");
      return;
    }

    try {
      const submission = { ...formData };

      const res = await fetch("http://localhost:3001/Fcreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message || "Failed to submit feedback.");
        return;
      }

      if (res.ok) {
        setPublishError(null);
        alert("Submission successful");
        navigate("/dashboard/allfeed");
      }
    } catch (error) {
      setPublishError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="background d-flex justify-content-center align-items-center"style={{marginTop:"30px"}}>
      {/* Background Overlay */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('https://i.pinimg.com/originals/5b/43/2d/5b432d5fb6bfd23190f34488cbcd6d0a.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      ></div>

      {/* Form Container */}
      <Row className="w-100 justify-content-center px-3">
        <Col xs={12} md={10} lg={8} xl={6}>
          <Card className="p-4 shadow-lg border-0"style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
            <Card.Body>
              <h2 className="text-center  mb-4" style={{fontSize:"30px",fontWeight:"bold",color:'#8B0000'}}>
                <i className="bi bi-chat-dots-fill me-2"style={{fontSize:"30px",fontWeight:"bold",color:'#8B0000'}}></i>Feedback Form
              </h2>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  {/* Name */}
                  <Form.Group as={Col} md={6} controlId="name">
                    <Form.Label>
                      <i className="bi bi-person-fill me-1"></i>Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      onChange={handleChange}
                      isInvalid={!!validation.name}
                      className="shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Rating */}
                  <Form.Group as={Col} md={6} controlId="rating">
                    <Form.Label>
                      <i className="bi bi-star-fill me-1"></i>Rating
                    </Form.Label>
                    <Form.Control
                      as="select"
                      defaultValue=""
                      onChange={handleChange}
                      isInvalid={!!validation.rating}
                      className="shadow-sm"
                      
                    >
                      <option value="">Select</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {validation.rating}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  {/* Email */}
                  <Form.Group as={Col} md={6} controlId="email">
                    <Form.Label>
                      <i className="bi bi-envelope-fill me-1"></i>Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      onChange={handleChange}
                      isInvalid={!!validation.email}
                      className="shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Vehicle ID */}
                  <Form.Group as={Col} md={6} controlId="vehicalid">
                    <Form.Label>
                      <i className="bi bi-car-front-fill me-1"></i>Vehicle ID
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., AB1234"
                      onChange={handleChange}
                      isInvalid={!!validation.vehicalid}
                      className="shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.vehicalid}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  {/* Phone */}
                  <Form.Group as={Col} md={6} controlId="phone">
                    <Form.Label>
                      <i className="bi bi-telephone-fill me-1"></i>Phone
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., 0123456789"
                      maxLength={10}
                      onChange={handleChange}
                      isInvalid={!!validation.phone}
                      className="shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validation.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                {/* Description */}
                <Form.Group className="mb-4" controlId="descrip">
                  <Form.Label>
                    <i className="bi bi-pencil-square me-1"></i>Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter your feedback"
                    onChange={handleChange}
                    isInvalid={!!validation.descrip}
                    className="shadow-sm"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validation.descrip}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Submit Button */}
                <Button variant="danger" type="submit" className="w-100 fw-bold rounded-pill shadow-sm" style={{ padding: '10px', fontSize: '16px',color:'#000' }}>
                Submit Feedback
              </Button>
            </Form>

              {/* Publish Error */}
              {publishError && (
                <Alert variant="danger" className="mt-4 text-center">
                  {publishError}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
