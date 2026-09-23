import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import bhomayagService from './bhomayagService';

export const getAllBhomayags = createAsyncThunk(
  'bhomayag/getAll',
  async (thunkAPI) => {
    try {
      return await bhomayagService.getAllBhomayag();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchBhomayagThunk = createAsyncThunk(
  'bhomayag/search',
  async (query, thunkAPI) => {
    try {
      return await bhomayagService.searchBhomayag(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteBhomayagThunk = createAsyncThunk(
  "bhomayag/delete-bhomayag",
  async (id, thunkAPI) => {
    try {
      return await bhomayagService.deleteBhomyag(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getABhomayagThunk = createAsyncThunk(
  "bhomayag/get-bhomayag",
  async (id, thunkAPI) => {
    try {
      return await bhomayagService.getSingleBhomayag(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
    bhomayags: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

const bhomayagSlice = createSlice({
  name: 'bhomayag',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBhomayags.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBhomayags.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.bhomayag = action.payload;
      })
      .addCase(getAllBhomayags.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(searchBhomayagThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchBhomayagThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.bhomayag = action.payload;
      })
      .addCase(searchBhomayagThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteBhomayagThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBhomayagThunk.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedBhomayag = action.payload;
      })
    .addCase(deleteBhomayagThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })
    .addCase(getABhomayagThunk.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getABhomayagThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.bhomName = action.payload.name;
        state.bhomEmail = action.payload.email;
        state.bhomPhone = action.payload.mobile_no;
        state.bhomDate = action.payload.date;
        state.bhomAdhar = action.payload.adhar_no;
        state.bhomMsg = action.payload.message;
    })
    .addCase(getABhomayagThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })

      .addCase(resetState, () => initialState);
  },
});

export default bhomayagSlice.reducer;