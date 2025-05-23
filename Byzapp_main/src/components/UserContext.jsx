import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import e from "cors";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUser(decodedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    const token = userData.token;
    const decodedToken = jwt_decode(token);
    setUser(decodedToken);

    Cookies.set("token", token, { expires: 2 });
    Cookies.set("user", JSON.stringify(decodedToken));

    setIsLoggedIn(true);
  };

  const onLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        user,
        handleLogin,
        onLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};