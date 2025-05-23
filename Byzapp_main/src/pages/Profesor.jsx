import React from "react";
import Cover from "../components/Cover";
import { Link } from "react-router-dom";
import UserInfo from "../components/UserInfo";


//Barra de navegación para cambiar de pestañas.
const Profesor = ({ user, onLogout }) => {
    return (
    
    <div className="profesorpage-container">
        <Cover user = {user} onLogout = {onLogout}></Cover>
        <UserInfo user={user} onLogout = {onLogout}   ></UserInfo>
        <h1> Profesores </h1>
    </div>
    
    );
};

export default Profesor;