import axios from "axios";
import { base_booking_url2, base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

export const customerSignUp = async (user) => {
  const response = await axios.post(`${base_booking_url2}user/register`, user, config);
  return response.data;
};

const login = async (user) => {
  // base_booking_url2
  const response = await axios.post(`${base_booking_url2}user/login`, user);
  // console.log(response,"hello")
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const authService = { customerSignUp, login };
export default authService;