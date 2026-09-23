// src/utils/axiosconfig.js

const getTokenFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  if (!user) return "";
  try {
    return JSON.parse(user).token;
  } catch {
    return "";
  }
};

export const config = {
  headers: {
    Authorization: `Bearer ${getTokenFromLocalStorage()}`,
    Accept: "application/json",
  },
  withCredentials: true,
};
