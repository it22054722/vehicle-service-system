import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
  Card,
  Image,
  Spinner,
  Alert,
} from "react-bootstrap";

const DEFAULT_AVATAR =
  "data:image/jpeg;base64,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";

export default function AllFeedback() {
  const [info, setInfo] = useState([]);
  const [filter, setFilter] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3001/FgetAll`);
        const data = await res.json();
        if (res.ok) {
          setInfo(data.items);
          setFilter(data.items);
        } else {
          setError(data.message || "Failed to fetch feedback.");
        }
      } catch (error) {
        console.error(error.message);
        setError("An unexpected error occurred while fetching feedback.");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  // Function to display star rating based on feedback rating
  const renderStars = (rating) => {
    let stars = 0;
    if (rating === "High") stars = 5;
    if (rating === "Medium") stars = 3;
    if (rating === "Low") stars = 1;
    return Array.from({ length: stars }, (_, index) => (
      <span key={index} style={{ color: "#FFD700", marginRight: "2px" }}>
        ★
      </span>
    ));
  };

  // Search and rating filter
  useEffect(() => {
    let filteredData = info;

    if (query.trim() !== "") {
      filteredData = filteredData.filter(
        (feedback) =>
          feedback.name.toLowerCase().includes(query.toLowerCase()) ||
          feedback.descrip.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedRating) {
      filteredData = filteredData.filter(
        (feedback) => feedback.rating === selectedRating
      );
    }

    setFilter(filteredData);
  }, [query, selectedRating, info]);

  return (
    <div
      className="background d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1950&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "220px",
      }}
    >
      {/* Main Content */}
      <Container className="py-5">
        <Card
          className="bg-opacity-90 p-4 shadow-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "15px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <Row className="mb-4">
            <Col>
              <h1
                className="text-center"
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  color: "#8B0000",
                  textShadow: "2px 2px #f0f0f0",
                }}
              >
                Feedback &amp; Rating
              </h1>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-4">
            <Col
              md={6}
              className="mb-2"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <InputGroup style={{ width: "100%" }}>
                <InputGroup.Text
                  id="search-icon"
                  style={{
                    backgroundColor: "#8B0000",
                    border: "none",
                  }}
                >
                  <i className="bi bi-search" style={{ color: "#fff" }}></i>
                </InputGroup.Text>
                <FormControl
                  placeholder="Search by name or feedback..."
                  aria-label="Search"
                  aria-describedby="search-icon"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{
                    borderRadius: "0 10px 10px 0",
                    border: "1px solid #8B0000",
                  }}
                />
              </InputGroup>
            </Col>
            <Col
              md={6}
              className="mb-2"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Form.Select
                aria-label="Filter by rating"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                style={{
                  borderRadius: "10px",
                  border: "1px solid #8B0000",
                  backgroundColor: "#fff",
                  color: "#8B0000",
                }}
              >
                <option value="">All Ratings</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Feedback List */}
          <Row>
            <Col>
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "200px" }}
                >
                  <Spinner
                    animation="border"
                    variant="primary"
                    style={{ width: "3rem", height: "3rem" }}
                  />
                </div>
              ) : error ? (
                <Alert
                  variant="danger"
                  className="text-center"
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "#ffe6e6",
                    borderColor: "#ff4d4d",
                  }}
                >
                  {error}
                </Alert>
              ) : filter && filter.length > 0 ? (
                <div
                  style={{
                    maxHeight: "500px",
                    overflowY: "auto",
                    paddingRight: "10px",
                  }}
                >
                  <Row xs={1} md={1} lg={1} className="g-4">
                    {filter.map((feedback) => (
                      <Col key={feedback._id}>
                        <Card
                          className="h-100"
                          style={{
                            border: "none",
                            borderRadius: "15px",
                            boxShadow:
                              "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
                            transition: "transform 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.02)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        >
                          <Card.Body>
                            <Row className="align-items-center">
                              <Col
                                xs={3}
                                md={2}
                                className="text-center"
                                style={{ paddingRight: "0" }}
                              >
                                <Image
                                  src={
                                    feedback.avatar
                                      ? `data:image/jpeg;base64,${feedback.avatar}`
                                      : DEFAULT_AVATAR
                                  }
                                  alt={feedback.name}
                                  roundedCircle
                                  fluid
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                    border: "2px solid #8B0000",
                                  }}
                                />
                              </Col>
                              <Col xs={9} md={10}>
                                <Card.Title
                                  style={{
                                    fontSize: "1.5rem",
                                    color: "#8B0000",
                                  }}
                                >
                                  {feedback.name}
                                </Card.Title>
                                <Card.Subtitle
                                  className="mb-2"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "1rem",
                                    color: "#555",
                                  }}
                                >
                                  {renderStars(feedback.rating)}{" "}
                                  <span style={{ marginLeft: "8px" }}>
                                    {feedback.rating}
                                  </span>
                                </Card.Subtitle>
                                <Card.Text
                                  style={{
                                    fontSize: "1.1rem",
                                    color: "#333",
                                  }}
                                >
                                  {feedback.descrip}
                                </Card.Text>
                              </Col>
                            </Row>
                          </Card.Body>
                          <Card.Footer
                            className="text-muted text-end"
                            style={{
                              fontSize: "0.9rem",
                              backgroundColor: "transparent",
                              borderTop: "1px solid #e0e0e0",
                            }}
                          >
                            {moment(feedback.updatedAt).format(
                              "MMMM D, YYYY [at] h:mm A"
                            )}
                          </Card.Footer>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              ) : (
                <p
                  className="text-center text-secondary"
                  style={{ fontSize: "1.2rem" }}
                >
                  No feedback available.
                </p>
              )}
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
}
