import React from "react";
import Cover from "../components/Cover";

const Descargar = ({ user, isLoggedIn, onLogout }) => {
  return (
    <div>
      <Cover user={user} onLogout={onLogout} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>Descargar:</h1>
      <br />
      <br />
      <h2>Liga:</h2>
      <h2>
        https://drive.google.com/drive/folders/1ohFNr9qFYjV4CFmC0bEovd6SVsTy8Hzy?usp=sharing
      </h2>
    </div>
  );
};

export default Descargar;
