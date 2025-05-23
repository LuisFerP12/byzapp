import React, { useContext } from "react";
import { UserContext } from "../components/UserContext";
import "../styles/ProfileCard.css";
import mesirve from "../images/mesirve.jpg";
import Cover from "./Cover";

function ProfileCard() {
  const { user, onLogout } = useContext(UserContext) || {};

  return (
    <div>
    <Cover></Cover>
    <div className="profile-card-container">
      <header>
     
        <br></br>
        <img className="profile-image" src={mesirve} alt={user.name} />
        <br></br>
        <br></br>

      </header>
      <br></br>
      <h1 className="profile-name">
        Nombre: <span className="profile-subtitle">{user.name}</span>
      </h1>
     
      <h2 className="profile-unique-name">ID: {user.sub}</h2>
      
      <div className="profile-social-container">
        
            <div className="profile-followers">
            <h1 className="profile-stat">{user.email}</h1>
            <h2 className="profile-stat-label">Email</h2>
            </div>
            <div className="profile-likes">
            <h1 className="profile-stat">{user.unique_name}</h1>
            <h2 className="profile-stat-label">Nombre de usuario:</h2>
            </div>
            
            
        </div>
        
      </div>
    </div>
    
  );
}

export default ProfileCard;
