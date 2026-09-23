import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import darshanService from './darshanService';

export const getAllDarshanThunk = createAsyncThunk(
  'darshan/getAll',
  async (thunkAPI) => {
    try {
      return await darshanService.getAllDarshan();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchDarshanThunk = createAsyncThunk(
  'darshan/search',
  async (query, thunkAPI) => {
    try {
      return await darshanService.searchDarshan(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteDarshanThunk = createAsyncThunk(
  "darshan/delete-darshan",
  async (id, thunkAPI) => {
    try {
      return await darshanService.deleteDarshan(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getADarshanThunk = createAsyncThunk(
  "darshan/get-darshan",
  async (id, thunkAPI) => {
    try {
      return await darshanService.getSingleDarshan(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
    darshans: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

const darshanSlice = createSlice({
  name: 'darshan',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllDarshanThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDarshanThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.darshan = action.payload;
      })
      .addCase(getAllDarshanThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(searchDarshanThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchDarshanThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.darshan = action.payload;
      })
      .addCase(searchDarshanThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteDarshanThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDarshanThunk.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedDarshan = action.payload;
      })
    .addCase(deleteDarshanThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })
    .addCase(getADarshanThunk.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getADarshanThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.darName = action.payload.name;
        state.darEmail = action.payload.email;
        state.darPhone = action.payload.mobile_no;
        state.darDate = action.payload.date;
        state.darAdhar = action.payload.adhar_no;
        state.darMsg = action.payload.message;
    })
    .addCase(getADarshanThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })

      .addCase(resetState, () => initialState);
  },
});

export default darshanSlice.reducer;