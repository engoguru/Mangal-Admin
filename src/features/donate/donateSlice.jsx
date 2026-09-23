import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import donateService from './donateService';

// export const getAllDonates = createAsyncThunk(
//   'donate/getAll',
//   async (thunkAPI) => {
//     try {
//       return await donateService.getAllDonate();
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );
export const getAllDonates = createAsyncThunk(
  "donate/get-all",
  async (params, thunkAPI) => {
    try {
      return await donateService.getAllDonate(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchDonateThunk = createAsyncThunk(
  'donate/search',
  async (query, thunkAPI) => {
    try {
      return await donateService.searchDonate(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteDonateThunk = createAsyncThunk(
  "donate/delete-donate",
  async (id, thunkAPI) => {
    try {
      return await donateService.deleteDonate(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getADonateThunk = createAsyncThunk(
  "donate/get-donate",
  async (id, thunkAPI) => {
    try {
      return await donateService.getSingleDonate(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
    donates: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

const donateSlice = createSlice({
  name: 'donates',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllDonates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDonates.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.donate = action.payload;
      })
      .addCase(getAllDonates.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(searchDonateThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchDonateThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.donate = action.payload;
      })
      .addCase(searchDonateThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteDonateThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDonateThunk.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedDonate = action.payload;
      })
    .addCase(deleteDonateThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })
    .addCase(getADonateThunk.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getADonateThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.donName = action.payload.name;
        state.donEmail = action.payload.email;
        state.donPhone = action.payload.mobile_no;
        state.donAmount = action.payload.amount;
        state.donAdd = action.payload.address;
    })
    .addCase(getADonateThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })

      .addCase(resetState, () => initialState);
  },
});

export default donateSlice.reducer;