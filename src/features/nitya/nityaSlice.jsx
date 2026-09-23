import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import nityaService from './nityaService';

export const getAllNityas = createAsyncThunk(
  'nitya/getAll',
  async (thunkAPI) => {
    try {
      return await nityaService.getAllNitya();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchNityaThunk = createAsyncThunk(
  'nitya/search',
  async (query, thunkAPI) => {
    try {
      return await nityaService.searchNitya(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteNityaThunk = createAsyncThunk(
  "nitya/delete-nitya",
  async (id, thunkAPI) => {
    try {
      return await nityaService.deleteNitya(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getANityaThunk = createAsyncThunk(
  "nitya/get-nitya",
  async (id, thunkAPI) => {
    try {
      return await nityaService.getSingleNitya(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
    nityas: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

const nityaSlice = createSlice({
  name: 'nitya',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllNityas.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllNityas.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.nitya = action.payload;
      })
      .addCase(getAllNityas.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(searchNityaThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchNityaThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.nitya = action.payload;
      })
      .addCase(searchNityaThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteNityaThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNityaThunk.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedNitya = action.payload;
      })
    .addCase(deleteNityaThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })
    .addCase(getANityaThunk.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getANityaThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.nitName = action.payload.name;
        state.nitEmail = action.payload.email;
        state.nitPhone = action.payload.mobile_no;
        state.nitDate = action.payload.date;
        state.nitAdhar = action.payload.adhar_no;
        state.nitMsg = action.payload.message;
    })
    .addCase(getANityaThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })

      .addCase(resetState, () => initialState);
  },
});

export default nityaSlice.reducer;