import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function ManageFeedback() {
  const [info, setInfo] = useState([]);
  const [dId, setFormId] = useState("");
  const [filter, setFilter] = useState([]);
  const [query, setQuery] = useState("");
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
        console.log(error.message);
        setError("An unexpected error occurred while fetching feedback.");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleDeleteUser = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const res = await fetch(`http://localhost:3001/Fdelete/${dId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setInfo((prev) => prev.filter((employee) => employee._id !== dId));
          setFilter((prev) => prev.filter((employee) => employee._id !== dId));
          Swal.fire("Deleted!", "The feedback has been deleted.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete the feedback.", "error");
        }
      }
    } catch (error) {
      console.log(error.message);
      Swal.fire("Error!", "An unexpected error occurred.", "error");
    }
  };

  useEffect(() => {
    if (query.trim() === "") {
      setFilter([...info]);
    } else {
      const filteredData = info.filter((employee) =>
        employee.name && employee.name.toLowerCase().includes(query.toLowerCase()) ||
        employee.descrip && employee.descrip.toLowerCase().includes(query.toLowerCase())
      );
      setFilter(filteredData);
    }
  }, [query, info]);

  return (
    <Container fluid className="h-100 position-relative" style={{
      minHeight: "100vh",
      backgroundImage: "url('https://i.pinimg.com/originals/5b/43/2d/5b432d5fb6bfd23190f34488cbcd6d0a.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "20px",
    }}>
      {/* Overlay for better readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1,
      }}></div>

      <Row className="justify-content-center align-items-center h-100" style={{ position: "relative", zIndex: 2 }}>
        <Col md={10} lg={8} className="text-center"> {/* Adjusted column width for better responsiveness */}
          {/* Header */}
          <h1 style={{
            color: '#8B0000',
            fontWeight: "bold",
            marginBottom: "20px",
            textShadow: "2px 2px #000",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}>
            Manage Feedback
          </h1>

          {/* Search Form */}
          <Form className="mb-4" style={{ maxWidth: "500px", margin: "0 auto" }}>
            <Form.Control
              type="text"
              placeholder="Search by name or feedback..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                borderRadius: "30px",
                padding: "10px 20px",
                fontSize: "1rem",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                border: "none",
              }}
            />
          </Form>

          {/* Feedback Table Card */}
          <Card className="bg-white bg-opacity-80 shadow-lg rounded" style={{
            maxHeight: "600px",
            overflowY: "auto",
            padding: "20px",
            borderRadius: "15px",
          }}>
            {/* Loading Spinner */}
            {loading && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}>
                <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="danger" style={{
                borderRadius: "10px",
                backgroundColor: "#ffe6e6",
                borderColor: "#ff4d4d",
                textAlign: "center",
              }}>
                {error}
              </Alert>
            )}

            {/* Feedback Table */}
            {!loading && !error && (
              <Table responsive bordered hover className="text-center" style={{
                width: "100%",
                margin: "0 auto",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "10px",
                overflow: "hidden",
              }}>
                <thead style={{
                  backgroundColor: "#8B0000",
                  color: "#FFD700",
                  position: "sticky",
                  top: 0,
                }}>
                  <tr>
                    <th>Vehicle ID</th>
                    <th>Name</th>
                    <th>Rating</th>
                    <th>Feedback</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filter && filter.length > 0 ? (
                    filter.map((employee, index) => (
                      <tr key={employee._id} style={{
                        backgroundColor: index % 2 === 0 ? "rgba(255, 255, 255, 0.7)" : "rgba(240, 240, 240, 0.7)",
                        transition: "background-color 0.3s",
                      }}>
                        <td style={{ verticalAlign: "middle" }}>{employee.vehicalid}</td>
                        <td style={{ verticalAlign: "middle" }}>{employee.name}</td>
                        <td style={{ verticalAlign: "middle" }}>
                          <span style={{
                            padding: "5px 10px",
                            borderRadius: "15px",
                            backgroundColor: employee.rating === "High" ? "#28a745" :
                                              employee.rating === "Medium" ? "#ffc107" :
                                              "#dc3545",
                            color: "#fff",
                            fontWeight: "bold",
                          }}>
                            {employee.rating}
                          </span>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>{employee.descrip}</td>
                        <td style={{ verticalAlign: "middle" }}>
                          <Link to={`/dashboard/feedupdate/${employee._id}`}>
                            <Button variant="outline-secondary" style={{ // Changed to gray color
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "5px 10px",
                              borderRadius: "30px",
                              transition: "background-color 0.3s, color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#6c757d"; // Darker gray on hover
                              e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "#6c757d"; // Gray color
                            }}>
                              <FaEdit style={{ marginRight: "5px" }} /> Edit
                            </Button>
                          </Link>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <Button
                            variant="outline-danger"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "5px 10px",
                              borderRadius: "30px",
                              transition: "background-color 0.3s, color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#dc3545";
                              e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "#dc3545";
                            }}
                            onClick={() => {
                              setFormId(employee._id);
                              handleDeleteUser();
                            }}
                          >
                            <FaTrashAlt style={{ marginRight: "5px" }} /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: "20px" }}>
                        <Alert variant="info" style={{
                          borderRadius: "10px",
                          backgroundColor: "#e6f7ff",
                          borderColor: "#91d5ff",
                          textAlign: "center",
                          fontSize: "1.1rem",
                        }}>
                          You have no feedback to display.
                        </Alert>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
