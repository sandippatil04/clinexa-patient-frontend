import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthConfig = () => ({ headers: { token } });

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) setDoctors(data.doctors);
    } catch (error) {
      console.error("Doctors fetch failed:", error);
    }
  };

  const getProfileData = async () => {
    if (!token) {
      setUserData(null);
      return;
    }
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, getAuthConfig());
      if (data.success) setUserData(data.user);
      else {
        localStorage.removeItem("token");
        setToken("");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken("");
      }
    }
  };

  const registerUser = async (name, email, password) => {
    const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
    if (data.success) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUserData(data.user);
    }
    return data;
  };

  const loginUser = async (email, password) => {
    const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
    if (data.success) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUserData(data.user);
    }
    return data;
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserData(null);
  };

  const updateProfile = async (profile) => {
    const { data } = await axios.put(`${backendUrl}/api/user/profile`, profile, getAuthConfig());
    if (data.success) setUserData(data.user);
    return data;
  };

  const getAppointments = async () => {
    if (!token) return { success: false, message: "Please login" };
    const { data } = await axios.get(`${backendUrl}/api/appointment/user`, getAuthConfig());
    return data;
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    getProfileData().finally(() => setLoading(false));
  }, [token]);

  const value = {
    currencySymbol,
    backendUrl,
    doctors,
    token,
    setToken,
    userData,
    setUserData,
    loading,
    registerUser,
    loginUser,
    logoutUser,
    updateProfile,
    getAppointments,
    calculateAge,
    slotDateFormat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
