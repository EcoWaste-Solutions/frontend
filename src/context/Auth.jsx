import { useState, useEffect, useContext, createContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: "",
  });

  // Retrieve token from localStorage on initial load
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("auth"));
    if (data?.accessToken) {
      setAuth({ accessToken: data.accessToken });
    }
  }, []);

  // Store the token in localStorage whenever it changes
  useEffect(() => {
    if (auth.accessToken) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth"); // Clear if token is removed
    }
  }, [auth]);

  // Set the Authorization header in axios instance
  axios.interceptors.request.use((config) => {
    if (auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  });

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

// Custom hook to use the auth context
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
