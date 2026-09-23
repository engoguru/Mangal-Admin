import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customers/customerSlice";
import contactReducer from "../features/contact/contactSlice";
import abhishekReducer from "../features/abhishek/abhishekSlice";
import bhomayagReducer from "../features/bhomayag/bhomayagSlice";
import hawanatmakReducer from "../features/hawanatmak/hawanatmakSlice";
import nityaReducer from "../features/nitya/nityaSlice";
import panchamritReducer from "../features/panchamrit/panchamritSlice";
import specialReducer from "../features/special/specialSlice";
import darshanReducer from "../features/darshan/darshanSlice";
import donateReducer from "../features/donate/donateSlice"
import livelinkReducer from "../features/liveLink/livelinkSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    contact: contactReducer,
    abhishek: abhishekReducer,
    darshan: darshanReducer,
    bhomayag: bhomayagReducer,
    hawanatmak: hawanatmakReducer,
    nitya: nityaReducer,
    panchamrit: panchamritReducer,
    special: specialReducer,
    donate: donateReducer,
    liveLink: livelinkReducer
  },
});
