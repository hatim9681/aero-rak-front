// UserContext.js
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLogged: false,
    user_id: -1,
    role: "",
  });

  const checkUser = () => {
    const founded = localStorage.getItem("user");
    if (founded === "true") {
      setUser({
        isLogged: true,
        user_id: localStorage.getItem("user_id"),
        role: localStorage.getItem("role"),
      });
    }
  };

  const logoutUser = () => {
    setUser({
      isLogged: false,
      user_id: -1,
      role: "",
    });
    // Additional logic for clearing local storage or performing other logout tasks
  };

  return (
    <UserContext.Provider value={{ user, setUser, checkUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserContext;
