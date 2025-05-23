import React from "react";
import Cover from "../components/Cover";

const Usuario = ({ user, isLoggedIn, onLogout }) => {
  return (
    <div>
      <Cover user={user} onLogout={onLogout} />
      <h1>Usuario</h1>
    </div>
  );
};

export default Usuario;
