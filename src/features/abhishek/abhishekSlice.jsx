import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import abhishekService from './abhishekService';

export const getAllAbhisheks = createAsyncThunk(
  "abhishek/getAll",
  async (
    { page = 1, limit = 10, search = "", typeOfAbhishek = "" },
    thunkAPI
  ) => {
    try {
      return await abhishekService.getAllAbhishek(
        page,
        limit,
        search,
        typeOfAbhishek
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data
      );
    }
  }
);

export const searchAbhishekThunk = createAsyncThunk(
  'abhishek/search',
  async (query, thunkAPI) => {
    try {
      return await abhishekService.searchAbhishek(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteAbhishekThunk = createAsyncThunk(
  "abhishek/delete-abhishek",
  async (id, thunkAPI) => {
    try {
      return await abhishekService.deleteAbhishek(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAAbhishekThunk = createAsyncThunk(
  "abhishek/get-abhishek",
  async (id, thunkAPI) => {
    try {
      return await abhishekService.getSingleAbhishek(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getTotalBookingsThunk = createAsyncThunk(
  'abhishek/getTotalBookings',
  async (thunkAPI) => {
    try {
      return await abhishekService.getTotalBookings();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
    abhisheks: [],
    totalBookings: 0,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

const abhishekSlice = createSlice({
  name: 'abhishek',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAbhisheks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAbhisheks.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.abhishek = action.payload;
      })
      .addCase(getAllAbhisheks.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getTotalBookingsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTotalBookingsThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.totalBookings = action.payload.totalBookings;
      })
      .addCase(getTotalBookingsThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(searchAbhishekThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchAbhishekThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.abhishek = action.payload;
      })
      .addCase(searchAbhishekThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteAbhishekThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAbhishekThunk.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedAbhishek = action.payload;
      })
    .addCase(deleteAbhishekThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })
    .addCase(getAAbhishekThunk.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getAAbhishekThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.abhName = action.payload.name;
        state.abhEmail = action.payload.email;
        state.abhPhone = action.payload.mobile_no;
        state.abhDate = action.payload.date;
        state.abhDob = action.payload.dob;
        state.abhRel = action.payload.relationship;
        state.abhAdhar = action.payload.adhar_no;
        state.abhMsg = action.payload.message;
    })
    .addCase(getAAbhishekThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })

      .addCase(resetState, () => initialState);
  },
});

export default abhishekSlice.reducer;