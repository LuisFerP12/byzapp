import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cover from "../components/Cover";
import Grade from "../components/Grade";
import { UserContext } from "../components/UserContext";
import "../styles/ExamComponent.css";
import { useLocation } from "react-router-dom";
import ExamComponent from "../components/ExamComponent";
import CalifEstudiante from "../components/CalifEstudiante";

const CalificacionesAlumno = () => {
  const [isActive, setIsActive] = useState(false);
  const { user, onLogout } = useContext(UserContext) || {};
  const [calificacion, setCalificacion] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const studentId = searchParams.get("studentId");
  const groupId = searchParams.get("groupId");
  const nombreStudent = searchParams.get("nombreEstudiante");
  const encodedExam = searchParams.get('exam');
  const exam = JSON.parse(decodeURIComponent(encodedExam));

  console.log("id del estudiante en calificaciones alumno pene", studentId)
  console.log("examen encontrado en calificaciones del alumno", exam);
  console.log("nombre del estudiante encontradopenepnee" , nombreStudent)

  return (
    <div>
      <Cover user={user} onLogout={onLogout} />
      <br />
      <br />
      <br />
      <br />
      
      {user && user.user_role === "Profesor" && (
        <div>
          <br />
          <h2>  Calificación del Estudiante {nombreStudent} </h2>
          <div className="div2">
            
            <CalifEstudiante key={exam.idExamen} exam={exam} groupId={exam.groupId} studentId = {studentId}  />
          
          </div>
        </div>
      )}
      {user && user.user_role === "Estudiante" && (
        <div>
          <br />
          <div className="div2">
            
              <CalifEstudiante key={exam.idExamen} exam={exam} groupId={groupId} studentId = {studentId}  />
             
          </div>
        </div>
      )}
    </div>
  );
};

export default CalificacionesAlumno;
