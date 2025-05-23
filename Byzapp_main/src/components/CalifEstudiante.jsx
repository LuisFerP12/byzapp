import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GradeEstudentProfesor from "../components/GradeEstudentProfesor";
import { UserContext } from "../components/UserContext"; // Importa el contexto de usuario
import "../styles/ExamComponent.css";
import EditExam from "./EditExam";

const CalifEstudiante = ({ exam, groupId, studentId }) => {
  const [isActive, setIsActive] = useState(true);
  const { user, onLogout } = useContext(UserContext) || {};
  const [calificacion, setCalificacion] = useState(null);


  const urlParams = {
    groupId: groupId,
    exam: JSON.stringify(exam),
  };

  console.log("id estudiante en comp calif estudiante", studentId)
  const encodedExam = encodeURIComponent(urlParams.exam);

  const url = `/leaderboard?groupId=${urlParams.groupId}&exam=${encodedExam}`;

  return (
    <div>
      
        <div className="accordion-item">
          <div className="accordion-total">
    
            <div
              className="accordion-title"
              onClick={() => setIsActive(!isActive)}
            >
              <div>{exam.nombreExamen} </div>
              <div>
                {isActive ? (
                    <i className="bi bi-eye-slash"></i>
                ) : (
                  <i className="bi bi-eye"></i>
                )}
              </div>
            </div>
          </div>
          {isActive && (
            <div className="accordion-content">
              <GradeEstudentProfesor exam={exam} studentId = {studentId} />
            </div>
          )}
        </div>
      
    </div>
  );
};

export default CalifEstudiante;