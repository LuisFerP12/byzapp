import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import swal from "sweetalert";
import { UserContext } from "../components/UserContext";
import logo from "../images/logoyamamalon.png";
import "../styles/Register.css";

const Register = () => {
  const [emailReg, setEmailReg] = useState("");
  const [nombre, setNombre] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [password2Reg, setPassword2Reg] = useState("");
  const [usernameReg, setUsernameReg] = useState("");
  const [typeReg, setTypeReg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registerStatus, setRegisterStatus] = useState("");
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [emailFieldStyle, setEmailFieldStyle] = useState("");
  const [passwordFieldStyle, setPasswordFieldStyle] = useState("");
  const [userFieldStyle, setUserFieldStyle] = useState("");
  const { handleLogin } = useContext(UserContext);

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

  const handleToggleVisibilityConfirm = (e) => {
    e.preventDefault();
    setVisible2(!visible2);
    const passwordInput = document.getElementById("confirm-password");
    if (passwordInput) {
      const { selectionStart, selectionEnd } = passwordInput;
      setTimeout(() => {
        passwordInput.setSelectionRange(selectionStart, selectionEnd);
        passwordInput.focus();
      }, 0);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (
      !emailReg.trim() ||
      !nombre.trim() ||
      !passwordReg.trim() ||
      !password2Reg.trim() ||
      !usernameReg.trim() ||
      !typeReg.trim()
    ) {
      swal("Error", "Algunos campos se encuentran vacíos", "error", {
        button: false,
      });
      setIsLoading(false);
      return;
    }

    var correoValido = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    var contraseñaValida = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/;

    if (!correoValido.test(emailReg)) {
      setEmailFieldStyle("-error");
      setPasswordFieldStyle("");
      setUserFieldStyle("");
      swal("Error", "Por favor, ingresa un correo válido", "error", {
        button: false,
      });
      return setIsLoading(false);
    }

    if (!contraseñaValida.test(passwordReg)) {
      setEmailFieldStyle("");
      setPasswordFieldStyle("-error");
      setUserFieldStyle("");
      swal(
        "Error",
        "La contraseña debe tener al menos 8 caracteres y contener letras y números",
        "error",
        {
          button: false,
        }
      );
      return setIsLoading(false);
    }

    if (passwordReg === password2Reg) {
      try {
        const apiUrl =
          typeReg === "profesor"
            ? "https://localhost:7095/api/Estudiante/AddProfesor"
            : "https://localhost:7095/api/Estudiante/AddEstudiante";
        console.log(apiUrl);
        const response = await axios.post(apiUrl, {
          nombre: nombre,
          contraseña: passwordReg,
          email: emailReg,
          username: usernameReg,
        });

        console.log(response.data);
        handleLogin(response.data);

        navigate("/");
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error);

        if (
          error.response.data ===
          "El correo y el nombre de usuario ya están en uso."
        ) {
          setEmailFieldStyle("-error");
          setPasswordFieldStyle("");
          setUserFieldStyle("-error");
        }

        if (error.response.data === "El correo ya está en uso.") {
          setEmailFieldStyle("-error");
          setPasswordFieldStyle("");
          setUserFieldStyle("");
        }

        if (error.response.data === "El nombre de usuario ya está en uso.") {
          setEmailFieldStyle("");
          setPasswordFieldStyle("");
          setUserFieldStyle("-error");
        }
        swal("Error", error.response.data, "error", {
          button: false,
        });
      }
    } else {
      setEmailFieldStyle("");
      setPasswordFieldStyle("-error");
      setUserFieldStyle("");
      swal("Error", "Las contraseñas no coinciden", "error", {
        button: false,
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="front-page-containerREG">
      <img src={logo} alt="logo" className="logo" />
      <div className="formREG">
        <center>
          <form onSubmit={handleRegister}>
            <div className="titulo">
              <h2>Registro</h2>
            </div>
            <div className={`correo-container${emailFieldStyle}`}>
              <input
                type="text"
                onChange={(e) => setEmailReg(e.target.value)}
                placeholder="Correo electrónico"
              />
            </div>
            <div className="correo-container">
              <input
                type="text"
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
              />
            </div>
            <div className={`contraseña-container${passwordFieldStyle}`}>
              <input
                type={visible ? "text" : "password"}
                placeholder="Contraseña"
                id="password"
                value={passwordReg}
                onChange={(e) => setPasswordReg(e.target.value)}
              />
              <label className="eye-icon" onClick={handleToggleVisibility}>
                {visible ? (
                  <i className="bi bi-eye"></i>
                ) : (
                  <i className="bi bi-eye-slash"></i>
                )}
              </label>
            </div>
            <div className={`contraseña-container${passwordFieldStyle}`}>
              <input
                type={visible2 ? "text" : "password"}
                id="confirm-password"
                placeholder="Confirmar contraseña"
                value={password2Reg}
                onChange={(e) => setPassword2Reg(e.target.value)}
              />
              <label
                className="eye-icon"
                onClick={handleToggleVisibilityConfirm}
              >
                {visible2 ? (
                  <i className="bi bi-eye"></i>
                ) : (
                  <i className="bi bi-eye-slash"></i>
                )}
              </label>
            </div>
            <div className={`correo-container${userFieldStyle}`}>
              <input
                type="text"
                onChange={(e) => setUsernameReg(e.target.value)}
                placeholder="Nombre de usuario"
              />
            </div>
            <h3 className="tipoUsuario">¿Eres un alumno o un profesor?</h3>
            <div className="radio">
              <input
                type="radio"
                onChange={() => setTypeReg("profesor")}
                name="Puesto"
                id="Profesor"
                checked={typeReg === "profesor"}
              />
              <label htmlFor="Profesor">Profesor</label>
              <input
                type="radio"
                onChange={() => setTypeReg("estudiante")}
                name="Puesto"
                id="Estudiante"
                checked={typeReg === "estudiante"}
              />
              <label htmlFor="Estudiante">Estudiante</label>
            </div>
            <hr />
            <div className="crear-cuenta-container2">
              {isLoading ? (
                <div className="loader-container">
                  <BarLoader
                    color="#5A7C96"
                    loading={isLoading}
                    width={300}
                    height={5}
                  />
                </div>
              ) : (
                <input type="Submit" value="Registrarme" />
              )}
            </div>
            <h1> {registerStatus}</h1>
          </form>
        </center>
      </div>
    </div>
  );
};

export default Register;
