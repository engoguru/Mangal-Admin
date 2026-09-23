import axios from 'axios';
import { base_url } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';

const getAllHwanatmak = async () => {
  const response = await axios.get(`${base_url}/hawanatmak/all`, config);
  return response.data;
};
  
const searchHwanatmak = async (query) => {
  const response = await axios.get(`${base_url}/hawanatmak/search`, { params: query });
  return response.data;
};

const getTotalBookings = async () => {
  const response = await axios.get(`${base_url}/hawanatmak/total-bookings`, config);
  return response.data;
};

const deleteHwanatmak = async (id) => {
  const response = await axios.delete(`${base_url}/hawanatmak/delete/${id}`, config);
  return response.data;
};

const getSingleHwanatmak = async (id) => {
  const response = await axios.get(`${base_url}/hawanatmak/single/${id}`, config);
  return response.data;
};
  
const hawanatmakService = {
  getAllHwanatmak,
  searchHwanatmak,
  deleteHwanatmak,
  getSingleHwanatmak,
  getTotalBookings
};
  
export default hawanatmakService;