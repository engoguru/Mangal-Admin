import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import specialService from './specialService';

export const getAllSpecials = createAsyncThunk(
  'special/getAll',
  async (thunkAPI) => {
    try {
      return await specialService.getAllSpecial();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchSpecialThunk = createAsyncThunk(
  'special/search',
  async (query, thunkAPI) => {
    try {
      return await specialService.searchSpecial(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteSpecialThunk = createAsyncThunk(
  "special/delete-special",
  async (id, thunkAPI) => {
    try {
      return await specialService.deleteSpecial(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getASpecialThunk = createAsyncThunk(
  "special/get-special",
  async (id, thunkAPI) => {
    try {
      return await specialService.getSingleSpecial(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
    specials: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

const specialSlice = createSlice({
  name: 'special',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSpecials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSpecials.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.special = action.payload;
      })
      .addCase(getAllSpecials.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(searchSpecialThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchSpecialThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.special = action.payload;
      })
      .addCase(searchSpecialThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteSpecialThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSpecialThunk.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedSpecial = action.payload;
      })
    .addCase(deleteSpecialThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })
    .addCase(getASpecialThunk.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getASpecialThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.spcName = action.payload.name;
        state.spcEmail = action.payload.email;
        state.spcPhone = action.payload.mobile_no;
        state.spcDate = action.payload.date;
        state.spcAdhar = action.payload.adhar_no;
        state.spcMsg = action.payload.message;
    })
    .addCase(getASpecialThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })

      .addCase(resetState, () => initialState);
  },
});

export default specialSlice.reducer;