import axios from 'axios';
import { base_booking_url2 } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';

const getAllDarshan = async () => {
  const response = await axios.get(`${base_booking_url2}/darshan/all`,config);
  return response.data;
};
  
const searchDarshan = async (query) => {
  const response = await axios.get(`${base_booking_url2}/darshan/search`, { params: query });
  return response.data;
};

const deleteDarshan = async (id) => {
  const response = await axios.delete(`${base_booking_url2}/darshan/delete/${id}`,config);
  return response.data;
};

const getSingleDarshan = async (id) => {
  const response = await axios.get(`${base_booking_url2}/darshan/single/${id}`, config);
  return response.data;
};
  
const darshanService = {
  getAllDarshan,
  searchDarshan,
  deleteDarshan,
  getSingleDarshan
};
  
export default darshanService;