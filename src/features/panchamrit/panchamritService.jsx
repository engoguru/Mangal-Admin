import axios from 'axios';
import { base_booking_url2 } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';

const getAllPanchamrit = async () => {
  const response = await axios.get(`${base_booking_url2}/panchamrit/all`, config);
  return response.data;
};
  
const searchPanchamrit = async (query) => {
  const response = await axios.get(`${base_booking_url2}/panchamrit/search`, { params: query });
  return response.data;
};

const deletePanchamrit = async (id) => {
  const response = await axios.delete(`${base_booking_url2}/panchamrit/delete/${id}`, config);
  return response.data;
};

const getSinglePanchamrit = async (id) => {
  const response = await axios.get(`${base_booking_url2}/panchamrit/single/${id}`, config);
  return response.data;
};
  
const panchamritService = {
  getAllPanchamrit,
  searchPanchamrit,
  deletePanchamrit,
  getSinglePanchamrit
};
  
export default panchamritService;