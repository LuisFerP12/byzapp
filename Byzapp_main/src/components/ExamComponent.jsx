import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Grade from "../components/Grade";
import { UserContext } from "../components/UserContext"; // Importa el contexto de usuario
import "../styles/ExamComponent.css";
import EditExam from "./EditExam";

const ExamComponent = ({ exam, groupId }) => {
  const [isActive, setIsActive] = useState(false);
  const { user, onLogout } = useContext(UserContext) || {};
  const [calificacion, setCalificacion] = useState(null);

  const urlParams = {
    groupId: groupId,
    exam: JSON.stringify(exam),
  };

  const encodedExam = encodeURIComponent(urlParams.exam);

  const url = `/leaderboard?groupId=${urlParams.groupId}&exam=${encodedExam}`;

  return (
    <div>
      {user && user.user_role === "Profesor" && (
        <div className="accordion-item">
          <div className="accordion-total">
            <button className="stats">
              <Link
                to={url}
              >
                <i class="bi bi-list-ol"></i>
              </Link>
            </button>

            <div
              className="accordion-title"
              onClick={() => setIsActive(!isActive)}
            >
              <div>{exam.nombreExamen} </div>
              <div>{isActive ? "-" : <i class="bi bi-pencil-square"></i>}</div>
            </div>
          </div>
          {isActive && (
            //Aquí todo el contenido adentro del acordeon.
            <div className="accordion-content">
              <EditExam exam={exam} />
            </div>
          )}
        </div>
      )}

      {user && user.user_role === "Estudiante" && (
        <div className="accordion-item">
          <div className="accordion-total">
            <button className="stats">
              <Link
                to={`/leaderboard?groupId=${groupId}&examId=${exam.idExamen}`}
              >
                <i class="bi bi-list-ol"></i>
              </Link>
            </button>
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
              <Grade exam={exam} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamComponent;
