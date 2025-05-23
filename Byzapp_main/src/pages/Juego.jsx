import React from "react";
import Cover from "../components/Cover";

const Juego = ({ user, isLoggedIn, onLogout }) => {
  return (
    <div>
      <Cover user={user} onLogout={onLogout}>
        {" "}
      </Cover>

      <h1> Juego By-Zapp </h1>
    </div>
  );
};

export default Juego;
