import axios from 'axios';
import { base_booking_url2 } from '../../utils/base_url';
import { config } from '../../utils/axiosconfig';


const getUsers = async () => {
    
    const response = await axios.get(`${base_booking_url2}user`, config);
    return response.data;
};

const deleteUser = async (id) => {
    const response = await axios.delete(`${base_booking_url2}/users/delete/${id}`, config);
    return response.data;
  };

const customerService = {
    getUsers,
    deleteUser
};

export default customerService;