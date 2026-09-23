import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import panchamritService from './panchamritService';

export const getAllPanchamrits = createAsyncThunk(
  'panchamrit/getAll',
  async (thunkAPI) => {
    try {
      return await panchamritService.getAllPanchamrit();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchPanchamritThunk = createAsyncThunk(
  'panchamrit/search',
  async (query, thunkAPI) => {
    try {
      return await panchamritService.searchPanchamrit(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deletePanchamritThunk = createAsyncThunk(
  "panchamrit/delete-panchamrit",
  async (id, thunkAPI) => {
    try {
      return await panchamritService.deletePanchamrit(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getAPanchamritThunk = createAsyncThunk(
  "panchamrit/get-panchamrit",
  async (id, thunkAPI) => {
    try {
      return await panchamritService.getSinglePanchamrit(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
    panchamrits: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

const panchamritSlice = createSlice({
  name: 'panchamrit',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPanchamrits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPanchamrits.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.panchamrit = action.payload;
      })
      .addCase(getAllPanchamrits.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(searchPanchamritThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchPanchamritThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.panchamrit = action.payload;
      })
      .addCase(searchPanchamritThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deletePanchamritThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePanchamritThunk.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedPanchamrit = action.payload;
      })
    .addCase(deletePanchamritThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })
    .addCase(getAPanchamritThunk.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getAPanchamritThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.pnchName = action.payload.name;
        state.pnchEmail = action.payload.email;
        state.pnchPhone = action.payload.mobile_no;
        state.pnchDate = action.payload.date;
        state.pnchAdhar = action.payload.adhar_no;
        state.pnchMsg = action.payload.message;
    })
    .addCase(getAPanchamritThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })

      .addCase(resetState, () => initialState);
  },
});

export default panchamritSlice.reducer;