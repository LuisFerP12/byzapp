import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { UserContext } from "../components/UserContext";
import "../styles/Grade.css";
//
const Grade = ({ exam }) => {
  const { user, onLogout } = useContext(UserContext) || {};
  const [calificacion, setCalificacion] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const calificacion2 = Math.round(calificacion * 10) / 10;
  const examId = exam.idExamen;
  const estudianteId = user?.sub || "";

  useEffect(() => {
    const fetchCalificacion = async () => {
      const token = Cookies.get("token");

      try {
        const response = await axios.get(
          `https://localhost:7095/api/Estudiante/CalculateStudentGrade/${estudianteId}/${examId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCalificacion(response.data);

        const answersResponse = await axios.get(
          `https://localhost:7095/api/Estudiante/GetStudentExamAnswers/${examId}/${estudianteId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudentAnswers(answersResponse.data);
        console.log("EL EXAMEN QUE HIZO EL ALUMNO ALAVERGA", studentAnswers);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCalificacion();
  }, [estudianteId]);

  return (
    <div>
      <h2>Calificación:</h2>
      <div className="circle-bar">
        <CircularProgressbarWithChildren value={calificacion}>
          <div className="circle-text">
            <strong>{calificacion2} %</strong>
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <div className="div-answer">
        <h3 className="font3">Respuestas:</h3>
      </div>
      <div className="div-answers">
        {studentAnswers.map((answer) => (
          <>
            <hr />
            <p className="font2" key={answer.preguntaId}>
              Pregunta: {answer.preguntaEnunciado}
              <br />
              Respuesta: {answer.respuestaText}
              <br />
              Correcta: {answer.esCorrecta ? "Sí" : "No"}
            </p>
          </>
        ))}
      </div>
    </div>
  );
};

export default Grade;
