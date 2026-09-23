import axios from 'axios';
import { base_booking_url2, base_url } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';

// const getAllDonate = async () => {
//   // base_booking_url2
//   const response = await axios.get(`${base_booking_url2}donate/all`, config);
//   return response.data;
// };
const getAllDonate = async ({ page = 1, limit = 10, search = "" }) => {
  const response = await axios.get(
    `${base_booking_url2}donate/all?page=${page}&limit=${limit}&search=${search}`,
    config
  );

  return response.data;
};
  
const searchDonate = async (query) => {
  const response = await axios.get(`${base_url}/donate/search`, { params: query });
  return response.data;
};

const deleteDonate = async (id) => {
  const response = await axios.delete(`${base_booking_url2}donate/delete/${id}`, config);
  return response.data;
};

const getSingleDonate = async (id) => {
  const response = await axios.get(`${base_url}/donate/single/${id}`, config);
  return response.data;
};
  
const donateService = {
  getAllDonate,
  searchDonate,
  deleteDonate,
  getSingleDonate
};
  
export default donateService;