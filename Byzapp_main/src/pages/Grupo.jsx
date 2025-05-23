import axios from "axios";
import React, { useState } from "react";
import Cover from "../components/Cover";

const Grupo = ({ user, isLoggedIn, onLogout, showModal, closeModal }) => {
  const [groupName, setGroupName] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/groups", {
        useridProfesor: user.idProfesor,
        nombre: groupName,
      });
      console.log("Group registered", response.data);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Cover user={user} onLogout={onLogout}>
        {" "}
      </Cover>
      <div className="modal-background"></div>
      <div className="modal-card">
        <p className="modal-card-title">Register Group</p>
        <section className="modal-card-body">
          <form onSubmit={handleFormSubmit}>
            <div className="field">
              <label className="label">Group Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <button type="submit" className="button is-link">
                Register Group
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Grupo;
