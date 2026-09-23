import axios from 'axios';
import { base_booking_url2, base_url } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';

const getAllContact = async (page, limit, search) => {
  // base_booking_url2
  const response = await axios.get(`${base_booking_url2}contact/viewAll?page=${page}&limit=${limit}&search=${search}`, config);
  return response.data;
};
  
const searchContact = async (query) => {
  const response = await axios.get(`${base_url}/contact/search`, { params: query });
  return response.data;
};

const deleteContact = async (id) => {
  const response = await axios.delete(`${base_booking_url2}contact/delete/${id}`, config);
  return response.data;
};

const getSingleContact = async (id) => {
  const response = await axios.get(`${base_url}/contact/single/${id}`, config);
  return response.data;
};
  
const contactService = {
  getAllContact,
  searchContact,
  deleteContact,
  getSingleContact
};
  
export default contactService;