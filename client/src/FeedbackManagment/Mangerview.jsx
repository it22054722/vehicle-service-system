import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Container, Row, Col, Card, Table, Form, Button, Alert } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaFilePdf } from "react-icons/fa"; 
import Swal from "sweetalert2"; 

export default function ManageFeedback() {
  const [info, setInfo] = useState([]);
  const [dId, setDId] = useState("");
  const [filter, setFilter] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3001/FgetAll`);
        const data = await res.json();
        if (res.ok) {
          setInfo(data.items);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchInfo();
  }, []);

  const handleDeleteUser = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this feedback?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3001/Fdelete/${dId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setInfo((prev) => prev.filter((employee) => employee._id !== dId));
          Swal.fire("Deleted!", "The feedback has been deleted.", "success");
        }
      } catch (error) {
        console.log(error.message);
        Swal.fire("Error!", "There was an issue deleting the feedback.", "error");
      }
    }
  };

  // Search functionality
  useEffect(() => {
    if (query.trim() === "") {
      setFilter([...info]);
    } else {
      const filteredData = info.filter((employee) =>
        employee.ItemsN?.toLowerCase().includes(query.toLowerCase())
      );
      setFilter(filteredData);
    }
  }, [query, info]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Feedback Report", 10, 10);
    const columns = [
      { title: "Rating", dataKey: "Rating" },
      { title: "Feedback", dataKey: "FeedBack" },
    ];
    const data = info.map((emp) => ({
      Rating: emp.rating,
      FeedBack: emp.descrip,
    }));
    doc.autoTable({
      columns: columns,
      body: data,
      styles: {
        cellPadding: 1,
        fontSize: 10,
        lineHeight: 1.2,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [255, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });
    doc.save("FeedbackReport.pdf");
  };

  return (
    <Container fluid className="h-100 position-relative">
      <img
  src="https://i.pinimg.com/originals/5b/43/2d/5b432d5fb6bfd23190f34488cbcd6d0a.jpg"
  alt=""
  className="position-fixed"
  style={{
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1, // Ensure it's behind other content
  }}
/>

      <Row className="justify-content-center align-items-center h-100 position-relative z-1" style={{marginTop:"100px"}}>
        <Col xs={12} md={10} lg={8}>
          <Card className="bg-light rounded shadow-lg my-4">
            <Card.Body>
              <h1 className="text-center text-uppercase text-dark mb-4">Feedback</h1>
              <Form className="mb-3">
                <Form.Group controlId="search">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setQuery(e.target.value)}
                    className="rounded-pill shadow-sm"
                    style={{ borderColor: "#dc3545", fontSize: "16px" }}
                  />
                </Form.Group>
              </Form>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Button
                  onClick={generatePDF}
                  variant="primary"
                  className="d-flex align-items-center"
                  style={{
                    backgroundColor: "#dc3545",
                    borderColor: "#dc3545",
                    padding: "0.5rem 1rem",
                    fontWeight: "bold",
                    borderRadius: "25px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c82333"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#dc3545"}
                >
                  <FaFilePdf className="me-2" /> Generate Report
                </Button>
              </div>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table
                  striped
                  bordered
                  hover
                  className="bg-white bg-opacity-75"
                  style={{ opacity: "0.85", borderRadius: "8px" }}
                >
                  <thead className="bg-dark text-white">
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
                    {filter.length > 0 ? (
                      filter.map((employee) => (
                        <tr key={employee._id} style={{ transition: "background-color 0.2s" }}>
                          <td>{employee.vehicalid}</td>
                          <td>{employee.name}</td>
                          <td>{employee.rating}</td>
                          <td>{employee.descrip}</td>
                          <td>
                            <Link to={`/dashboard/feedupdate/${employee._id}`}>
                              <Button
                                variant="outline-success"
                                className="d-flex align-items-center justify-content-center"
                                style={{ borderRadius: "25px", transition: "all 0.3s ease" }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = "#28a745"}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = "success"}
                              >
                                <FaEdit className="me-2" /> Edit
                              </Button>
                            </Link>
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              className="d-flex align-items-center justify-content-center"
                              onClick={() => {
                                setDId(employee._id);
                                handleDeleteUser();
                              }}
                              style={{ borderRadius: "25px", transition: "all 0.3s ease" }}
                              onMouseOver={(e) => e.currentTarget.style.borderColor = "#dc3545"}
                              onMouseOut={(e) => e.currentTarget.style.borderColor = "danger"}
                            >
                              <FaTrashAlt className="me-2" /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center">
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
}
