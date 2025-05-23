import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import Cover from "../components/Cover";
import Group from "../components/GroupComponent";
import MyModal from "../components/MyModal"; // Importa el componente MyModal
import { UserContext } from "../components/UserContext"; // Importa el contexto de usuario
import "../styles/MisGrupos.css";
import swal from "sweetalert";

const MisGrupos = () => {
  const [groups, setGroups] = useState([]);
  const { user, isLoggedIn, onLogout } = useContext(UserContext) || {};
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      
      const professorId = user?.sub;
      const token = Cookies.get("token");

      try {
        const response = await axios.get(
          `https://localhost:7095/api/Estudiante/groups/${professorId}`,
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
    <div className="background">
      <Cover user={user} onLogout={onLogout} />

      <div className="organize-groups">
        {groups.map((group) => (
          <div key={group.idGrupo}>
            <Group group={group} user={user} isLoggedIn={isLoggedIn} />
          </div>
        ))}
      </div>

      <div>
        <MyModal user={user} />
      </div>
    </div>
  );
};

export default MisGrupos;
