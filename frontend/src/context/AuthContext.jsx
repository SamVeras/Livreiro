import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState(localStorage.getItem("name"));

  const login = (newToken, userName) => {
    setToken(newToken);
    setName(userName);
    localStorage.setItem("token", newToken);
    localStorage.setItem("name", userName);
  };

  const logout = () => {
    setToken(null);
    setName(null);
    localStorage.removeItem("token");
    localStorage.removeItem("name");
  };

  return <AuthContext.Provider value={{ token, name, login, logout }}>{children}</AuthContext.Provider>;
}
