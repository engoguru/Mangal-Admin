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

// NOTE: `headers` is a getter on purpose.
// Previously the token was read ONCE when this module was first imported
// (i.e. before login), so every request sent right after login carried an
// empty "Bearer " header and data only loaded after a manual page refresh.
// A getter re-reads localStorage every time axios (or `...config`) reads it,
// so the fresh token is used immediately after login.
export const config = {
  get headers() {
    return {
      Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      Accept: "application/json",
    };
  },
  withCredentials: true,
};
