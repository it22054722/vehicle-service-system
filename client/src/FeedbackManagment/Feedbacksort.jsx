import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Alert, Table, Badge } from "react-bootstrap";
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

  // Group feedback by the person who gave it
  const groupByPerson = (feedbackData) => {
    return feedbackData.reduce((acc, feedback) => {
      const person = feedback.name;
      if (!acc[person]) {
        acc[person] = [];
      }
      acc[person].push(feedback);
      return acc;
    }, {});
  };

  // Grouped feedback by person's name
  const groupedFeedback = groupByPerson(filter);

  // Map categorical ratings to numerical values for calculations
  const ratingMapping = {
    High: 5,
    Medium: 3,
    Low: 1,
  };

  // Calculate total feedbacks, unique users, and average rating
  const totalFeedbacks = filter.length;
  const uniquePeople = Object.keys(groupedFeedback).length;
  const averageRating =
    filter.length > 0
      ? (
          filter.reduce((sum, feedback) => sum + (ratingMapping[feedback.rating] || 0), 0) / totalFeedbacks
        ).toFixed(1)
      : 0;

  // Function to get badge variant based on rating
  const getBadgeVariant = (rating) => {
    switch (rating) {
      case "High":
        return "success";
      case "Medium":
        return "warning";
      case "Low":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Container fluid className="h-100 position-relative">
      {/* Real-Time Statistics Section with User-Friendly Labels */}
      <Row className="justify-content-center text-center my-4">
        <Col xs={12} md={4}>
          <Card className="bg-primary text-white rounded shadow-lg mb-4">
            <Card.Body>
              <h4>Total Feedbacks Received</h4>
              <p>All feedback submitted by users so far:</p>
              <h2>{totalFeedbacks}</h2>
              <i className="fas fa-comments fa-2x"></i>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="bg-success text-white rounded shadow-lg mb-4">
            <Card.Body>
              <h4>Number of Unique Users</h4>
              <p>Distinct people who have submitted feedback:</p>
              <h2>{uniquePeople}</h2>
              <i className="fas fa-users fa-2x"></i>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="bg-warning text-dark rounded shadow-lg mb-4">
            <Card.Body>
              <h4>Average Feedback Rating</h4>
              <p>The average rating from all submitted feedback:</p>
              <h2>{averageRating} / 3</h2>
              <i className="fas fa-star fa-2x"></i>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Feedback Table Section */}
      <Row className="justify-content-center align-items-center h-100 position-relative" style={{ marginTop: "30px" }}>
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
                      <th>Name</th>
                      <th>Vehicle ID</th>
                      <th>Rating</th>
                      <th>Feedback</th>
                      <th>Feedback Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(groupedFeedback).length > 0 ? (
                      Object.entries(groupedFeedback).map(([person, feedbacks]) => (
                        <React.Fragment key={person}>
                          {feedbacks.map((feedback, index) => (
                            <tr key={feedback._id}>
                              <td>{feedback.name}</td>
                              <td>{feedback.vehicalid}</td>
                              <td>
                                <Badge bg={getBadgeVariant(feedback.rating)}>
                                  {feedback.rating}
                                </Badge>
                              </td>
                              <td>{feedback.descrip}</td>
                              {index === 0 && (
                                <td rowSpan={feedbacks.length} className="text-center align-middle">
                                  {feedbacks.length}
                                </td>
                              )}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
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
