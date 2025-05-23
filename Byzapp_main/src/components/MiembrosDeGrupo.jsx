import React from "react";

const MiembrosDeGrupo = ({ member }) => {
  return (
    <li className="member-item">
      <div className="member-image">
        <img
          src="https://cobaltsettlements.com/wp-content/uploads/2019/03/blank-profile.jpg"
          alt="Profile"
        />
      </div>
      <p>{member.nombreEstudiante}</p>
    </li>
  );
};

export default MiembrosDeGrupo;
