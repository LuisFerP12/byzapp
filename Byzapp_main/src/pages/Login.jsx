//Imports
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useState } from "react";
import { Link, Routes, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import swal from "sweetalert";
import { UserContext, UserProvider } from "../components/UserContext";
import logo from "../images/logoyamamalon.png";
import "../styles/Login.css";
/*El componente Login muestra un formulario de inicio de sesión con campos
 para el correo electrónico o nombre de usuario y la contraseña. */

const Login = () => {
  const navigate = useNavigate();

  // Estados para almacenar los valores de los campos del formulario

  // Los estados email y password se utilizan para almacenar los valores ingresados

  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Estado para controlar el estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Estado para mostrar el estado del inicio de sesión
  const [loginStatus, setLoginStatus] = useState("");

  // Estado para controlar la clase de estilo de los campos de entrada
  const [emailFieldStyle, setEmailFieldStyle] = useState("");
  const [passwordFieldStyle, setPasswordFieldStyle] = useState("");

  const { handleLogin } = useContext(UserContext);
  // Función para alternar la visibilidad de la contraseña

  const handleToggleVisibility = (e) => {
    e.preventDefault();
    setVisible(!visible);
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
      const { selectionStart, selectionEnd } = passwordInput;
      setTimeout(() => {
        passwordInput.setSelectionRange(selectionStart, selectionEnd);
        passwordInput.focus();
      }, 0);
    }
  };

  // Función para verificar el inicio de sesión
  const verifLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!email) {
        throw new Error("Favor de llenar el campo usuario");
      }

      const response = await axios.post(
        "https://localhost:7095/api/Estudiante/Login",
        { email: email, contraseña: password }
      );

      handleLogin(response.data);

      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.message === "Favor de llenar el campo usuario") {
        setLoginStatus("Favor de llenar el campo usuario");
        setEmailFieldStyle("-error");
        setPasswordFieldStyle("");
        swal(
          "Error",
          "El campo nombre de usuario/correo electrónico se encuentra vacío",
          "error",
          {
            button: false,
          }
        );
      } else {
        setLoginStatus("Contraseña incorrecta");
        setEmailFieldStyle("");
        setPasswordFieldStyle("-error");
        swal("Error", "Contraseña incorrecta", "error", {
          button: false,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /*Establecemos la estructura de los elementos del login. Cuando se hace clic en el botón "Iniciar sesión", 
    se invoca la función verifLogin, que realiza una solicitud de inicio de sesión. Si la solicitud es exitosa,
     se navega a la página principal. Si hay un error, se muestra un mensaje de alerta. */

    <div className="fs-img">
      <div className="front-page-container">
        <img src={logo} alt="logo" className="logo" />
        <div className="logo-container"></div>
        <center>
          <div className="form">
            <form>
              <div className={`correo-container${emailFieldStyle}`}>
                <input
                  type="text"
                  placeholder="Correo electrónico o nombre de usuario"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={`contraseña-container${passwordFieldStyle}`}>
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Contraseña"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="eye-icon" onClick={handleToggleVisibility}>
                  {visible ? (
                    <i className="bi bi-eye"></i>
                  ) : (
                    <i className="bi bi-eye-slash"></i>
                  )}
                </label>
              </div>
              <div className="iniciar-sesion">
                {isLoading ? (
                  <div className="loader">
                    <BarLoader
                      color="#5A7C96"
                      loading={isLoading}
                      width={300}
                      height={5}
                    />
                  </div>
                ) : (
                  <input
                    type="Submit"
                    onClick={verifLogin}
                    value="Iniciar sesión"
                  />
                )}
              </div>
              <div className="forgot-password">¿Olvidaste tu contraseña?</div>
              <hr />
              <div className="crear-cuenta-container">
                <Link to="/register">
                  <input type="Submit" value="Crear nueva cuenta" />
                </Link>
              </div>
            </form>
          </div>
        </center>
      </div>
    </div>
  );
};

export default Login;
