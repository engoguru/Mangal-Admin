import axios from 'axios';
import {base_booking_url2 } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';

const getAllBhomayag = async () => {
  const response = await axios.get(`${base_booking_url2}/bhomyag/all`, config);
  return response.data;
};
  
const searchBhomayag = async (query) => {
  const response = await axios.get(`${base_booking_url2}/bhomyag/search`, { params: query });
  return response.data;
};

const deleteBhomyag = async (id) => {
  const response = await axios.delete(`${base_booking_url2}/bhomyag/delete/${id}`, config);
  return response.data;
};

const getSingleBhomayag = async (id) => {
  const response = await axios.get(`${base_booking_url2}/bhomyag/single/${id}`, config);
  return response.data;
};
  
const bhomayagService = {
  getAllBhomayag,
  searchBhomayag,
  deleteBhomyag,
  getSingleBhomayag
};
  
export default bhomayagService;