import React from "react";
import Cover from "../components/Cover";

const Configuracion = ({ user, isLoggedIn, onLogout }) => {
  return (
    <div>
      <Cover user={user} onLogout={onLogout} />
      <h1>Configuración</h1>
    </div>
  );
};

export default Configuracion;
