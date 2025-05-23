import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import lout from "../images/log-out.png";
import mesirve from "../images/mesirve.jpg";
import settings from "../images/settings.png";
import us from "../images/user.png";
import { UserContext } from "./UserContext";
/*Aquí pondremso el modal que se desplegará al darle clic a tu usuario */

const UserSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const menuToggle = () => {
    const toggleMenu = document.querySelector(".menu");
    toggleMenu.classList.toggle("active");
  };

  const { user, isLoggedIn, onLogout } = useContext(UserContext) || {};

  return (
    <div>
      <li>
        <div className="action">
          <div className="profile" onClick={menuToggle}>
            <img src={mesirve} />
          </div>
          <div className="menu">
            <ul>
              <Link to="/Usuario">
                <li>
                  <img src={us} />
                  <a href="#">{user.unique_name}</a>
                </li>
              </Link>
              <Link to="/Configuracion">
                <li>
                  <img src={settings} />
                  <a href="#">Configuración</a>
                </li>
              </Link>
              <Link to="/">
                <li onClick={onLogout}>
                  <img src={lout} />
                  <a>Cerrar sesión </a>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </li>
    </div>
  );
};

export default UserSection;
