import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import Cover from "../components/Cover";
import Group from "../components/GroupComponent";
import MyModal from "../components/MyModal"; // Importa el componente MyModal
import { UserContext } from "../components/UserContext"; // Importa el contexto de usuario

function Student() {
  const [groups, setGroups] = useState([]);

  const { user, isLoggedIn, onLogout } = useContext(UserContext) || {};

  const estudianteId = user?.sub || "";

  //esta madre es la que traera todos los grupos segun el estudiante, también trae la info del profe relacionada a cada grupo.
  useEffect(() => {
    const fetchGroups = async () => {
      const token = Cookies.get("token");

      try {
        const response = await axios.get(
          `https://localhost:7095/api/Estudiante/studentgroups/${estudianteId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setGroups(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGroups();
  }, [user]);


  return (
    <div>
      <Cover />
      <div className="organize-groups">
        {groups.map((group) => (
          <div key={group.idGrupo}>
            <Group group={group} user={user} isLoggedIn={isLoggedIn} />
          </div>
        ))}
      </div>
      <MyModal user={user}></MyModal>
    </div>
  );
}

export default Student;
