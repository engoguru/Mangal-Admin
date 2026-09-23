import axios from 'axios';
import { base_booking_url2, base_url } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';

const getAllAbhishek = async (
  page,
  limit,
  search,
  typeOfAbhishek
) => {
  base_booking_url2
  const response = await axios.get(
    `${base_booking_url2}abhishek/viewAll?page=${page}&limit=${limit}&search=${search}&typeOfAbhishek=${typeOfAbhishek}`,
    config
  );

  return response.data;
};

const getTotalBookings = async () => {
  const response = await axios.get(`${base_url}/abhishek/total-bookings`, config);
  return response.data;
};
  
const searchAbhishek = async (query) => {
  const response = await axios.get(`${base_url}/abhishek/search`, { params: query });
  return response.data;
};

const deleteAbhishek = async (id) => {
  const response = await axios.delete(`${base_url}/abhishek/delete/${id}`, config);
  return response.data;
};

const getSingleAbhishek = async (id) => {
  const response = await axios.get(`${base_url}/abhishek/single/${id}`, config);
  return response.data;
};
  
const abhishekService = {
  getAllAbhishek,
  searchAbhishek,
  deleteAbhishek,
  getSingleAbhishek,
  getTotalBookings
};
  
export default abhishekService;