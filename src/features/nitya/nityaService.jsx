import axios from 'axios';
import { base_url } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';

const getAllNitya = async () => {
  const response = await axios.get(`${base_url}/nitya/all`, config);
  return response.data;
};
  
const searchNitya = async (query) => {
  const response = await axios.get(`${base_url}/nitya/search`, { params: query });
  return response.data;
};

const deleteNitya = async (id) => {
  const response = await axios.delete(`${base_url}/nitya/delete/${id}`,config);
  return response.data;
};

const getSingleNitya = async (id) => {
  const response = await axios.get(`${base_url}/nitya/single/${id}`, config);
  return response.data;
};
  
const nityaService = {
  getAllNitya,
  searchNitya,
  deleteNitya,
  getSingleNitya
};
  
export default nityaService;