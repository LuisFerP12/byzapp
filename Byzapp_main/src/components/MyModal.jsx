import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

const MyModal = ({ user }) => {
  const [token, setToken] = useState("");
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const estudianteId = user?.sub || "";
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  useEffect(() => {
    const exampleModal = document.getElementById("exampleModal");

    if (exampleModal) {
      exampleModal.addEventListener("show.bs.modal", (event) => {
        console.log(user?.sub);
        console.log("Modal shown");
        setGroupName("");
        setGroupDescription("");
      });
    }
  }, []);

  const handleSubmit = async () => {
    console.log("Estudiante_idEstudiante:", estudianteId);

    const requestToken = Cookies.get("token");

    try {
      if (!token || !estudianteId) {
        console.log("Token y ID de estudiante son requeridos");
        swal(
          "Error",
          "El token y el ID de estudiante son requeridos",
          "error",
          {
            button: false,
          }
        );
        return;
      }

      const response = await axios.post(
        "https://localhost:7095/api/Estudiante/groups/register",
        {
          token: token,
          estudianteId: estudianteId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${requestToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Estudiante registrado en el grupo:", response.data);
      } else {
        console.log(
          "Error al registrar estudiante en el grupo. Estado:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error al registrar estudiante en el grupo:", error);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    try {
      if ((groupName === "" || null) && (groupDescription === "" || null)) {
        console.log("Nombre y descripcion vacía");
        swal(
          "Error",
          "El nombre y la descripción se encuentran vacíos",
          "error",
          {
            button: false,
          }
        );
      } else if (groupName === "" || null) {
        console.log("Nombre Vacio");
        swal("Error", "El nombre se encuentra vacío", "error", {
          button: false,
        });
      } else if (groupDescription === "" || null) {
        console.log("Descripcion Vacio");
        swal("Error", "La descripción se encuentra vacía", "error", {
          button: false,
        });
      } else {
        const token = Cookies.get("token");

        console.log(user?.sub);
        console.log(groupName);
        console.log(groupDescription);

        console.log("ya se eta mandando al api suuu");
        const response = await axios.post(
          "https://localhost:7095/api/Estudiante/groups/create",
          {
            Profesor_idProfesor: user.sub,
            token: "token",
            nombre: groupName,
            descripcion: groupDescription,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Group created successfully:", response.data);

          window.location.reload();

          // Aquí puedes realizar cualquier acción adicional que necesites
        } else {
          swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al procesar su solicitud. Intente de nuevo",
          });

          // Aquí puedes manejar el caso de que la solicitud no sea exitosa
        }
      }
    } catch (error) {
      console.error("Error creating group:", error);

      // Aquí puedes manejar el caso de que ocurra un error en la solicitud
    }
  };

  return (
    <div>
      <button
        type="button"
        className="bi bi-plus-circle plus-button"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        data-bs-whatever="@mdo"
        style={{ fontSize: "3.5rem" }}
      ></button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        {user && user.user_role === "Profesor" && (
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Crea tu nuevo grupo
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={createGroup}>
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Nombre del grupo:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message-text" className="col-form-label">
                      Descripción:
                    </label>
                    <textarea
                      className="form-control"
                      id="message-text"
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cerrar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Crear grupo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {user && user.user_role === "Estudiante" && (
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Unirse a un nuevo grupo
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="token" className="col-form-label">
                      Token del grupo:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="token"
                      name="token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                    />
                  </div>
                  {console.log("token:", token)}

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cerrar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Unirse al grupo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyModal;
