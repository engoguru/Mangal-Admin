import axios from 'axios';
import { base_booking_url } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';

const createLive = async (liveData) => {
  const response = await axios.post(`${base_booking_url}/live/create`, liveData, config);
  return response.data;
};

const getAllLiveLink = async () => {
  const response = await axios.get(`${base_booking_url}/live/all`, config);
  return response.data;
};

const deleteLiveLink = async (id) => {
  const response = await axios.delete(`${base_booking_url}/live/${id}`, config);
  return response.data;
};

const getSingleLiveLink = async (id) => {
  const response = await axios.get(`${base_booking_url}/live/single/${id}`, config);
  return response.data;
};
  
const livelinkService = {
  getAllLiveLink,
  createLive,
  deleteLiveLink,
  getSingleLiveLink,
};
  
export default livelinkService;