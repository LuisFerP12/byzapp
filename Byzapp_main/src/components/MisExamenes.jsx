import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Cover from "../components/Cover";
import { UserContext } from "../components/UserContext"; // Importa el contexto de usuario
import "../styles/ExamComponent.css";
import ExamComponent from "./ExamComponent";

const MisExamenes = () => {
  const [exams, setExams] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const groupId = searchParams.get("groupId");
  const { user, onLogout } = useContext(UserContext) || {};
  const { isInGroup, setIsInGroup } = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = Cookies.get("token");

        const response = await axios.get(
          `https://localhost:7095/api/Estudiante/exams/group/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const examsData = response.data;
        setExams(examsData);
        console.log(examsData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchExams();
  }, [groupId]);

  return (
    <div>
      <Cover user={user} onLogout={onLogout} />
      <br />
      <h1>Exámenes</h1>

      {user && user.user_role === "Profesor" && (
        <div>
          <br />
          <div className="div2">
            <tbody>
              {exams.map((exam) => (
                <ExamComponent key={exam.idExamen} exam={exam} groupId = {groupId}/>
              ))}
            </tbody>
          </div>
          <div className="div3">
            <Link to="/examenes" state={{ groupId }}>
              <button className="button-perso">Crea un examen</button>
            </Link>
          </div>
        </div>
      )}
      {user && user.user_role === "Estudiante" && (
        <div>
          <br />
          <div className="div2">
            <tbody>
              {exams.map((exam) => (
                <ExamComponent key={exam.idExamen} exam={exam} groupId = {groupId} />
              ))}
            </tbody>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisExamenes;
