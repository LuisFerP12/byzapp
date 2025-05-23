import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import jedi from "../images/jedi.png";
import imgDefault from "../images/meeting.jpg";
import MiembrosDeGrupo from "./MiembrosDeGrupo";
import ProfilePic from "../images/ProfilePic.png";
import ProfilePic2 from "../images/ProfilePic2.png";
import "../styles/GroupComponent.css";

const Group = ({ group, user }) => {
  const [view, setView] = useState("group"); // 'group' or 'members'
  const [members, setMembers] = useState([]);
  const [showExams, setShowExams] = useState(false);

  const navigate = useNavigate();

  const handleViewExams = () => {
    setShowExams(true);
  };

  const handleViewMembers = async () => {
    const token = Cookies.get("token");
    const response = await axios.get(
      `https://localhost:7095/api/Estudiante/VerlosEstudiantesDeunGrupo/${group.idGrupo}/Estudiantes`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMembers(response.data);
    setView("members");
  };

  const handleViewGroup = () => {
    setView("group");
  };

  return (
    <>
      {view === "group" && user && user.user_role === "Profesor" && (
        <TeacherGroup group={group} onViewMembers={handleViewMembers} />
      )}
      {view === "group" && user && user.user_role === "Estudiante" && (
        <StudentGroup group={group} />
      )}
      {view === "members" && (
        <Members members={members} onGoBack={handleViewGroup} />
      )}
    </>
  );
};

const TeacherGroup = ({ group, onViewMembers }) => {
  const [showMembers, setShowMembers] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(group.token);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const viewGroupMembers = async () => {
    try {
      setShowMembers(true);
      const token = Cookies.get("token");
      const response = await axios.get(
        `https://localhost:7095/api/Estudiante/VerlosEstudiantesDeunGrupo/${group.idGrupo}/Estudiantes`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroupMembers(response.data);
      console.log("response data members pne :", response.data);
    } catch (error) {
      console.error("Error:", error);
      swal(
        "Error",
        "Ocurrió un error al obtener los miembros del grupo.",
        "error"
      );
    }
  };

  const goBack = () => {
    setShowMembers(false);
    setGroupMembers([]);
  };

  return (
    <div className="all">
      <div className="card-perso">
        <div className="image-content">
          <span className="overlay"> </span>
          <div className="card-image">
            <img src={imgDefault} alt="" className="card-img" />
          </div>
        </div>
        {!showMembers ? (
          <div className="card-content">
            <h1 className="name">{group.nombre}</h1>
            <p className="description">{group.descripcion}</p>

            <h2 className="token-text">
              Código: &nbsp;
              <span className="token-span">
                {group.token} &nbsp;
                <i className="fas fa-copy" onClick={handleCopy}></i>
              </span>
              <div className="copy-message-container">
                <p className={`copy-message ${isCopied ? "show" : ""}`}>
                  Codigo copiado!
                </p>
              </div>
            </h2>

            <div className="button-container-lol">
              <Link to={`/misexamenes?groupId=${group.idGrupo}`}>
                <button className="button-perso">Ver exámenes</button>
              </Link>
              <button
                className="button-perso button-perso-miembros"
                onClick={viewGroupMembers}
              >
                Ver miembros
              </button>
            </div>

            <span className="icon-perso2">
              <i
                className="bi bi-trash"
                onClick={() => deleteGrupo(group.idGrupo)}
              ></i>
            </span>
          </div>
        ) : (
          <div className="members-content scrollable">
            <h1 className="name">Miembros del Grupo</h1>
            <br />
            <ul className="member-list">
              {groupMembers.map((member, index) => (
                <li className="member-item" key={index}>
                  <img src={ProfilePic} alt="Profile Pic" />
                  <Link
                    to={`/ExamenesEstudiantePorGrupo?groupId=${group.idGrupo}&studentId=${member.estudianteId}&nombreEstudiante=${member.nombreEstudiante}`}
                  >
                    {member.nombreEstudiante}
                  </Link>
                </li>
              ))}
            </ul>
            <br />
            <button className="button-back" onClick={goBack}>
              Regresar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Members = ({ members, onGoBack }) => {
  return (
    <div className="members-view">
      <button onClick={onGoBack}>Go Back</button>
      <ul className="member-list scrollable">
        {members.map((member, index) => (
          <li key={index} className="member-item">
            <MiembrosDeGrupo member={member} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const deleteGrupo = (grupoId) => {
  swal({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará el grupo permanentemente.",
    icon: "warning",
    dangerMode: true,
    buttons: {
      cancelar: {
        text: "Cancelar",
        value: null,
        visible: true,
        className: "cancelar-swal",
        closeModal: true,
      },
      confirm: {
        text: "Confirmar",
        value: true,
        visible: true,
        className: "confirm-swal",
        closeModal: true,
      },
    },
  }).then((confirmacion) => {
    if (confirmacion) {
      eliminarGrupo(grupoId);
    }
  });
};

function eliminarGrupo(grupoId) {
  console.log("Eliminar grupo:", grupoId);
  const token = Cookies.get("token");
  console.log(token);

  try {
    axios
      .delete(`https://localhost:7095/api/Estudiante/RemoveGrupo/${grupoId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        swal(
          "Grupo eliminado",
          "El grupo ha sido eliminado correctamente.",
          "success",
          {
            button: false,
          }
        ).then(() => {
          console.log("Ya refresehea alv");
          window.location.reload();
        });
      });
  } catch (error) {
    console.error("Error:", error);
    swal("Error", "Ocurrió un error al eliminar el grupo.", "error");
  }
}

const StudentGroup = ({ group }) => {
  const [showMembers, setShowMembers] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  
  const viewGroupMembers = async () => {
    try {
      setShowMembers(true);
      const token = Cookies.get("token");
      const response = await axios.get(
        `https://localhost:7095/api/Estudiante/VerlosEstudiantesDeunGrupo/${group.grupo.idGrupo}/Estudiantes`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroupMembers(response.data);
    } catch (error) {
      console.error("Error:", error);
      swal(
        "Error",
        "Ocurrió un error al obtener los miembros del grupo.",
        "error"
      );
    }
  };

  const goBack = () => {
    setShowMembers(false);
    setGroupMembers([]);
  };

  return (
    <div className="all">
      <div className="card-perso">
        <center>
          <div className="image-content">
            <span className="overlay-alum"> </span>

            <div className="card-image-alum">
              <img src={jedi} alt="" className="card-img-alum" />
            </div>
          </div>
        </center>
        {!showMembers ? (
          <div className="card-content">
            <h1 className="name">{group.grupo.nombre}</h1>
            <p className="description">{group.grupo.descripcion}</p>
            <p>
              <b>Profesor:</b> {group.profesor.nombre}
            </p>
            <p>
              <b>Email:</b> {group.profesor.email}
            </p>
            <div className="button-container-lol-2">
            <Link to={`/misexamenes?groupId=${group.grupo.idGrupo}`}>
              <button className="button-perso-alum">Ver Exámenes </button>
            </Link>
            <button className="button-perso-alum" onClick={viewGroupMembers}>
              Ver miembros
            </button>
            </div>
          </div>
        ) : (
          <div className="members-content scrollable">
            <h1 className="name">Miembros del Grupo</h1>
            <br />
            <ul className="member-list">
              {groupMembers.map((member, index) => (
                <li className="member-item2" key={index}>
                  <img src={ProfilePic2} alt="Profile Pic" />
                  
                    {member.nombreEstudiante}
                  
                </li>
              ))}
            </ul>
            <br />
            <button className="button-back2" onClick={goBack}>
              Regresar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Group;
