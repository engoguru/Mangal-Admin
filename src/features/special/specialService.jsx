import axios from 'axios';
import { base_url } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';

const getAllSpecial = async () => {
  const response = await axios.get(`${base_url}/special/all`, config);
  return response.data;
};
  
const searchSpecial = async (query) => {
  const response = await axios.get(`${base_url}/special/search`, { params: query });
  return response.data;
};

const deleteSpecial = async (id) => {
  const response = await axios.delete(`${base_url}/special/delete/${id}`, config);
  return response.data;
};


const getSingleSpecial = async (id) => {
  const response = await axios.get(`${base_url}/special/single/${id}`, config);
  return response.data;
};
  
const specialService = {
  getAllSpecial,
  searchSpecial,
  deleteSpecial,
  getSingleSpecial
};
  
export default specialService;