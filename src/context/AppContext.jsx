import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const login = (user) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  return (
    <AppContext.Provider value={{ isDarkMode, toggleTheme, currentUser, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};
