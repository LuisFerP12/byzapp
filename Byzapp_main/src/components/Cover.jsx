import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import lout from "../images/log-out.png";
import logochiquito from "../images/logochicoE.png";
import mesirve from "../images/mesirve.jpg";
import settings from "../images/settings.png";
import us from "../images/user.png";
import "../styles/Cover.css";
import { UserContext } from "./UserContext";
import UserSection from "./UserSection";

const Cover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, onLogout } = useContext(UserContext) || {};
  const location = useLocation(); // Get the current location

  const menuToggle = () => {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu.classList.toggle("active");
  };

  function scrollToSection() {
    var section = document.getElementById("Nosotros");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/"); // Redirigir a la página principal
      setTimeout(() => {
        section = document.getElementById("Nosotros");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 500); // Esperar 1 segundo antes de hacer el desplazamiento
    }
  }

  function scrollToSectionHome() {
    var section = document.getElementById("root");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/"); // Redirigir a la página principal
      setTimeout(() => {
        section = document.getElementById("root");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 500); // Esperar 1 segundo antes de hacer el desplazamiento
    }
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="button-container">
            <ul id="my-list">
              <li>
                <img className="byzapplogo" src={logochiquito} alt="pene" />
              </li>

              <Link to="/">
                <li className={location.pathname === "/" ? "active" : ""}>
                  <button className="home" onClick={scrollToSectionHome}>
                    Inicio
                  </button>
                </li>
              </Link>

              <li>
                <button className="nosotros" onClick={scrollToSection}>
                  NOSOTROS
                </button>
              </li>

              {/* TODO ESTO ES PARA CUANDO EL USUARIO ESTA AUTENTICADO */}
              {user && user.user_role === "Profesor" && (
                <div className="buttons-student">
                  <Link to="/misgrupos">
                    <li
                      className={
                        location.pathname === "/misgrupos" ? "active" : ""
                      }
                    >
                      <button className="misEstudiantes"> GRUPOS </button>
                    </li>
                  </Link>
                </div>
              )}
              {user && user.user_role === "Estudiante" && (
                <div className="buttons-profesor">
                  <Link to="/avance">
                    <li
                      className={
                        location.pathname === "/avance" ? "active" : ""
                      }
                    >
                      <button className="misExamenes">Mi avance</button>
                    </li>
                  </Link>
                </div>
              )}
              {/* TODO ESTO ES PARA CUANDO EL USUARIO ESTA AUTENTICADO */}

              {/* el usuario no esta autenticado */}

              {user ? (
                // asdasd
                <li></li>
              ) : (
                <div>
                  <Link to="/Login">
                    <li
                      className={location.pathname === "/login" ? "active" : ""}
                    >
                      <button className="login">INGRESAR</button>
                    </li>
                  </Link>
                  <div className="user-section-estudiante">
                    <li
                      className={
                        location.pathname === "/descargar" ? "active" : ""
                      }
                    >
                      <Link to="https://drive.google.com/drive/folders/1ohFNr9qFYjV4CFmC0bEovd6SVsTy8Hzy?usp=sharing">
                        <button className="juegaloAhora">Juégalo Ahora</button>
                      </Link>
                    </li>
                  </div>
                </div>
              )}

              {/* Mover UserSection al final de la lista */}
              {user && user.user_role === "Profesor" && (
                <div className="user-section-profesor">
                  <li
                    className={
                      location.pathname === "/Descargar" ? "active" : ""
                    }
                  >
                    <Link to="https://drive.google.com/drive/folders/1ohFNr9qFYjV4CFmC0bEovd6SVsTy8Hzy?usp=sharing">
                      <button className="juegaloAhora">Juégalo Ahora</button>
                    </Link>
                  </li>

                  <UserSection onLogout={onLogout} user={user}></UserSection>
                </div>
              )}
              {user && user.user_role === "Estudiante" && (
                <div className="user-section-estudiante">
                  <li
                    className={
                      location.pathname === "/Descargar" ? "active" : ""
                    }
                  >
                    <Link to="https://drive.google.com/drive/folders/1ohFNr9qFYjV4CFmC0bEovd6SVsTy8Hzy?usp=sharing">
                      <button className="juegaloAhora">Juégalo Ahora</button>
                    </Link>
                  </li>

                  <UserSection onLogout={onLogout} user={user}></UserSection>
                </div>
              )}
            </ul>
          </div>
        </div>

        <div className="col-12">
          <div className="belowline"></div>
        </div>
      </div>
    </div>
  );
};

export default Cover;
