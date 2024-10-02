import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UpdateFeed() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { Id } = useParams();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`http://localhost:3001/FgetAll?itemId=${Id}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          const selected = data.items.find((item) => item._id === Id);
          if (selected) {
            setFormData(selected);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchFeedback();
  }, [Id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/Fupdate/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      alert("Feedback updated successfully!");
      navigate(`/dashboard/manage`);
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="background d-flex justify-content-center align-items-center vh-100">
      <div className="position-relative w-100 h-100">
        <img
          src="https://i.pinimg.com/originals/5b/43/2d/5b432d5fb6bfd23190f34488cbcd6d0a.jpg"
          alt="background"
          className="position-absolute w-100 h-100"
          style={{ opacity: 0.4, zIndex: -1, objectFit: "cover" }}
        />
        <div className="bg-light rounded shadow-lg p-4" style={{ opacity: 0.9, maxWidth: "500px", maxHeight: "700px", margin: "auto", marginTop: "40px" }}>
          <h1 className="text-center mb-4" style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#8B0000" }}>
            Update Feedback
          </h1>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="name">
                  <Form.Label className="fw-bold" style={{ color: "#8B0000" }}>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    value={formData.name || ""}
                    className="shadow-sm p-3"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="rating">
                  <Form.Label className="fw-bold" style={{ color: "#8B0000" }}>Rating</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    value={formData.rating || ""}
                    className="shadow-sm p-3"
                    style={{ borderRadius: "8px" }}
                  >
                    <option value="">Select</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="email">
                  <Form.Label className="fw-bold" style={{ color: "#8B0000" }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    value={formData.email || ""}
                    className="shadow-sm p-3"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="vehicalid">
                  <Form.Label className="fw-bold" style={{ color: "#8B0000" }}>Vehicle ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Vehicle ID"
                    onChange={(e) => setFormData({ ...formData, vehicalid: e.target.value })}
                    value={formData.vehicalid || ""}
                    className="shadow-sm p-3"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="phone">
                  <Form.Label className="fw-bold" style={{ color: "#8B0000" }}>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    maxLength={10}
                    placeholder="Enter your phone number"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    value={formData.phone || ""}
                    className="shadow-sm p-3"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="descrip" className="mb-3">
              <Form.Label className="fw-bold" style={{ color: "#8B0000" }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter feedback description"
                onChange={(e) => setFormData({ ...formData, descrip: e.target.value })}
                value={formData.descrip || ""}
                className="shadow-sm p-3"
                style={{ borderRadius: "8px" }}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="danger"
              className="w-100 fw-bold shadow-sm"
              style={{ padding: "12px", borderRadius: "30px", fontSize: "16px",color:"#000" }}
            >
              Update Feedback
            </Button>
          </Form>
          {publishError && (
            <Alert variant="danger" className="mt-3 text-center">
              {publishError}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
