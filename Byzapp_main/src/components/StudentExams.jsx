import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import "../styles/StudentExams.css";
import Cover from "./Cover";
import { UserContext } from "./UserContext";

function StudentExams() {
  const [exams, setExams] = useState([]);
  const { user, onLogout } = useContext(UserContext) || {};
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const studentId = searchParams.get("studentId");
  const groupId = searchParams.get("groupId");
  const nombreStudent = searchParams.get("nombreEstudiante");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7095/api/Estudiante/ExamenesEstudiantePorGrupo/${studentId}/${groupId}`
        );
        setExams(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchExams();
  }, [studentId, groupId]);

  return (
    <div>
      <Cover></Cover>
      <center>
        <div className="container-ver-exams">
          <h1 className="exam-header">Examenes del alumno {nombreStudent}</h1>
          <Row className="row">
            {exams.map((exam, index) => (
              <Col xs={12} md={4} key={index}>
                <Card className="exam-card">
                  <Card.Header as="h5">{exam.nombreExamen}</Card.Header>
                  <Card.Body>
                    <Card.Title>
                      <span>Intentos:</span> {exam.estudianteExamen.intentos}
                    </Card.Title>
                    <Card.Text>
                      <span>Calificación:</span>{" "}
                      {exam.estudianteExamen.calificación}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </center>
    </div>
  );
}

export default StudentExams;
