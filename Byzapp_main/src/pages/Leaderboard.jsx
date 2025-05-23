import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cover from "../components/Cover";
import { UserContext } from "../components/UserContext";
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const { user, onLogout } = useContext(UserContext) || {};

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const grupoId = searchParams.get("groupId");

  const encodedExam = searchParams.get("exam");
  const exam = JSON.parse(decodeURIComponent(encodedExam));

  const examenId = searchParams.get("examId") || exam.idExamen;

  console.log("sacar el grupoId y examenId", grupoId, examenId);

  console.log("ID del grupo:", grupoId);
  console.log("id del examen:", examenId);

  console.log("Objeto del examen:", exam);

  const urlParams = {
    exam: JSON.stringify(exam),
  };

  const encodedExamCalif = encodeURIComponent(urlParams.exam);

  const url = `/calificacionesAlumno=${urlParams.groupId}&exam=${encodedExamCalif}`;

  useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7095/api/Estudiante/Grupo/${grupoId}/Examen/${examenId}/MejoresCalificaciones`
        );
        setCalificaciones(response.data);
        console.log(
          "aquí deberían sacar los datos del leaderboard",
          response.data
        );
      } catch (error) {
        console.error("No se cargó el leaderboard:", error);
      }
    };

    fetchCalificaciones();
  }, [grupoId, examenId]);

  return (
    <div>
      <Cover user={user} onLogout={onLogout} />
      <br />
      <br />
      <br /> {/* Aquí tuneen con css jotos */}
      <br />
      <br />
      <div>
        <h2>Tabla de posiciones</h2>
        <br />
        <center>
          <ul>
            <div className="tabla">
              <li className="tablacolor">
                <div className="leaderboard-title">
                  <div className="index-alumno-title">
                    <p>Lugar</p>
                  </div>
                  <div className="estudiante-title">
                    <p>Estudiante</p>
                  </div>
                  <div className="calificacion-title">
                    <p>Calificación</p>
                  </div>
                  {user && user.user_role === "Profesor" && (
                    <div className="ver-alumno-title">
                      <p>Información</p>
                    </div>
                  )}
                </div>
              </li>
              {calificaciones.map((calificacion, index) => (
                <li key={index}>
                  <div className="leaderboard">
                    <div className="index-alumno">
                      <p>{index + 1}</p>
                    </div>
                    <div className="estudiante">
                      <p>{calificacion.nombreEstudiante}</p>
                    </div>
                    <div className="calificacion">
                      <p>{Math.round(calificacion.calificacion * 10) / 10}</p>
                    </div>
                    {user && user.user_role === "Profesor" && (
                      <div className="ver-alumno">
                        <div className="prebutton">
                          <Link
                            to={`/calificacionesAlumno?groupId=${grupoId}&exam=${encodedExamCalif}&studentId=${calificacion.idEstudiante}&nombreEstudiante=${calificacion.nombreEstudiante}`}
                          >
                            <button>
                              {/* Aquí mandamos el id del usuario en url para poder ver los datos de este wey  */}
                              Detalles
                            </button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </div>
          </ul>
        </center>
      </div>
    </div>
  );
};

export default Leaderboard;
