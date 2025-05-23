import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cover from "../components/Cover";
import { UserContext } from "../components/UserContext";
import Carlos from "../images/Carlos.png";
import D from "../images/D.png";
import I from "../images/I.png";
import Josue from "../images/JosueNuevo.jpg";
import LuisE from "../images/LuisE.png";
import LuisF from "../images/LuisF.png";
import Jesus from "../images/MRGNuevo.jpg";
import Rene from "../images/Rene.png";
import juego1 from "../images/juego1.png";
import juego2 from "../images/juego2.png";
import juego3 from "../images/juego3.jpg";
import logo from "../images/logoyamamalon.png";
import "../styles/Home.css";

//Barra de navegación para cambiar de pestañas.

/**
 * The Home function returns a React component that displays different sections based on the user type
 * and login status.
 * The Home component is being returned, which contains a Cover component and either a
 * ProfesorSection or a StudentSection component depending on the user's type and whether they are
 * logged in.
 */

const Home = () => {
  const { user, isLoggedIn, onLogout } = useContext(UserContext) || {};

  return (
    <div className="homepage-container">
      <Cover> </Cover>

      {isLoggedIn ? (
        user && user.user_role === "Profesor" ? (
          <ProfesorSection user={user} onLogout={onLogout} />
        ) : user && user.user_role === "Estudiante" ? (
          <StudentSection user={user} onLogout={onLogout} />
        ) : null
      ) : (
        <NoLoginSection />
      )}
    </div>
  );
};

const ProfesorSection = ({ user, onLogout }) => {
  const [fadeout, setFadeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeout(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <center>
        <div className={fadeout ? "fade-out user-login" : "user-login"}>
          <h1>¡Hola profesor {user.unique_name}!</h1>
        </div>
      </center>
      <HomeComponent />
    </>
  );
};

const StudentSection = ({ user, onLogout }) => {
  const [fadeout, setFadeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeout(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <center>
        <div className={fadeout ? "fade-out user-login" : "user-login"}>
          <h1>Hola estudiante {user.unique_name}</h1>
        </div>
      </center>
      <HomeComponent />
    </>
  );
};

const NoLoginSection = () => {
  return (
    <center>
      <div>
        <br />
        <br />
        <br />
        <br />
        <HomeComponent />
      </div>
    </center>
  );
};

const HomeComponent = () => {
  return (
    <div id="root">
      <div>
        <br />
        <img src={logo} alt="logo" className="logomam" />
        <br />

        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={juego1} className="d-block w-100" alt="juego1" />
            </div>
            <div className="carousel-item">
              <img src={juego2} className="d-block w-100" alt="juego2" />
            </div>
            <div className="carousel-item">
              <img src={juego3} className="d-block w-100" alt="juego3" />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <center>
          <div>
            <br />

            <div className="video-container inline-block">
              <iframe
                width="1120"
                height="630"
                src="https://www.youtube.com/watch?v=T_QRXF-O-yo"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
            <br />
            <div className="inline-block">
              <br />
              <br />
              <h1 className="abajo" id="Nosotros">
                {" "}
                Profesores
              </h1>
              <div className="tarjeta inline-block">
                <div className="section inline-block">
                  <img src={Josue} alt="Josue" />
                  <h2 className="bold-text">Josué Flores</h2>
                  <p className="italic-text">A00833132@tec.mx</p>
                </div>

                <div className="section inline-block">
                  <img src={LuisE} alt="Luis E" />
                  <h2 className="bold-text">Luis A. Escudero</h2>
                  <p className="italic-text">A00832309@tec.mx</p>
                </div>

                <div className="section inline-block">
                  <img src={Rene} alt="Rene" />
                  <h2 className="bold-text">Rene Tapia</h2>
                  <p className="italic-text">A00834888@tec.mx</p>
                </div>
              </div>
            </div>

            <div className="inline-block">
              <div className="tarjeta inline-block">
                <div className="section inline-block">
                  <img src={Carlos} alt="Carlos" />
                  <h2 className="bold-text">Carlos Mallén</h2>
                  <p className="italic-text">A00831838@tec.mx</p>
                </div>

                <div className="section inline-block">
                  <img src={Jesus} alt="Jesus" />
                  <h2 className="bold-text">Jesús D. Martínez</h2>
                  <p className="italic-text">A00833591@tec.mx</p>
                </div>

                <div className="section inline-block">
                  <img src={LuisF} alt="Luis F" />
                  <h2 className="bold-text">Luis F. Pérez</h2>
                  <p className="italic-text">A00832937@tec.mx </p>
                </div>
              </div>
            </div>
          </div>
        </center>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
      <div id="footer">
        <div class="text-row">
          <span>MANUAL</span>
          <span>GITHUB</span>
          <span>CONTACTO</span>
        </div>
        <div class="small-text">© 2023 Copyright: By-Zapp.com</div>
        <div class="line"></div>
      </div>
    </div>
  );
};

export default Home;
