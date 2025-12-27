// import React, { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     try {
//       const rawUser = localStorage.getItem("user");
//       const rawToken = localStorage.getItem("token");
//       if (rawUser) setUser(JSON.parse(rawUser));
//       if (rawToken) setToken(rawToken);
//     } catch (err) {
//       console.warn("Invalid stored auth", err);
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//     }
//   }, []);

//   const login = (resp) => {
//     const tokenVal = resp?.token || resp?.data?.token || resp?.data?.accessToken || resp?.accessToken;
//     const userVal = resp?.user || resp?.data?.user || resp?.data?.userInfo || resp?.data;

//     if (tokenVal) {
//       localStorage.setItem("token", tokenVal);
//       setToken(tokenVal);
//     }
//     if (userVal) {
//       localStorage.setItem("user", JSON.stringify(userVal));
//       setUser(userVal);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = ({ data }) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);