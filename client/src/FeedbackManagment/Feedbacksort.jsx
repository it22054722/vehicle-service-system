// FeedbackSort.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Table } from "react-bootstrap";
import Swal from "sweetalert2";

const FeedbackSort = () => {
  const [info, setInfo] = useState([]);
  const [filter, setFilter] = useState([]);
  const [vehicleId, setVehicleId] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3001/FgetAll`);
        const data = await res.json();
        if (res.ok) {
          setInfo(data.items);
          setFilter(data.items); // Initialize filter with fetched data
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchInfo();
  }, []);

  // Filter feedback based on vehicle ID
  useEffect(() => {
    if (vehicleId.trim() === "") {
      setFilter([...info]);
    } else {
      const filteredData = info.filter((feedback) =>
        feedback.vehicalid?.toLowerCase().includes(vehicleId.toLowerCase())
      );
      setFilter(filteredData);
    }
  }, [vehicleId, info]);

  return (
    <Container fluid className="h-100 position-relative">
      <Row className="justify-content-center align-items-center h-100 position-relative" style={{ marginTop: "100px" }}>
        <Col xs={12} md={10} lg={8}>
          <Card className="bg-light rounded shadow-lg my-4">
            <Card.Body>
              <h1 className="text-center text-uppercase text-dark mb-4">Feedback Filter by Vehicle ID</h1>
              <Form className="mb-3">
                <Form.Group controlId="vehicleIdSearch">
                  <Form.Control
                    type="text"
                    placeholder="Enter Vehicle ID..."
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="rounded-pill shadow-sm"
                    style={{ borderColor: "#dc3545", fontSize: "16px" }}
                  />
                </Form.Group>
              </Form>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table striped bordered hover className="bg-white bg-opacity-75">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>Vehicle ID</th>
                      <th>Name</th>
                      <th>Rating</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filter.length > 0 ? (
                      filter.map((feedback) => (
                        <tr key={feedback._id}>
                          <td>{feedback.vehicalid}</td>
                          <td>{feedback.name}</td>
                          <td>{feedback.rating}</td>
                          <td>{feedback.descrip}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">
                          <Alert variant="info" className="mb-0">
                            No feedback available
                          </Alert>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FeedbackSort;
