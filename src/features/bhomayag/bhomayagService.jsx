import axios from 'axios';
import { base_url } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';

const getAllBhomayag = async () => {
  const response = await axios.get(`${base_url}/bhomyag/all`, config);
  return response.data;
};
  
const searchBhomayag = async (query) => {
  const response = await axios.get(`${base_url}/bhomyag/search`, { params: query });
  return response.data;
};

const deleteBhomyag = async (id) => {
  const response = await axios.delete(`${base_url}/bhomyag/delete/${id}`, config);
  return response.data;
};

const getSingleBhomayag = async (id) => {
  const response = await axios.get(`${base_url}/bhomyag/single/${id}`, config);
  return response.data;
};
  
const bhomayagService = {
  getAllBhomayag,
  searchBhomayag,
  deleteBhomyag,
  getSingleBhomayag
};
  
export default bhomayagService;