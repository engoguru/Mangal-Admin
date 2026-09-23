import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import hawanatmakService from './hawanatmakService';

export const getAllHawanatmaks = createAsyncThunk(
  'hawanatmak/getAll',
  async (thunkAPI) => {
    try {
      return await hawanatmakService.getAllHwanatmak();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchHawanatmakThunk = createAsyncThunk(
  'hawanatmak/search',
  async (query, thunkAPI) => {
    try {
      return await hawanatmakService.searchHwanatmak(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteHawanatmakThunk = createAsyncThunk(
  "hawanatmak/delete-hawanatmak",
  async (id, thunkAPI) => {
    try {
      return await hawanatmakService.deleteHwanatmak(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getAHawanatmakThunk = createAsyncThunk(
  "hawanatmak/get-hawanatmak",
  async (id, thunkAPI) => {
    try {
      return await hawanatmakService.getSingleHwanatmak(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getTotalHawBookingsThunk = createAsyncThunk(
  'hawanatmak/getTotalBookings',
  async (thunkAPI) => {
    try {
      return await hawanatmakService.getTotalBookings();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
    hawanatmaks: [],
    totalBookings: 0,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

const hawanatmakSlice = createSlice({
  name: 'hawanatmak',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllHawanatmaks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllHawanatmaks.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.hawanatmak = action.payload;
      })
      .addCase(getAllHawanatmaks.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(searchHawanatmakThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchHawanatmakThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.hawanatmak = action.payload;
      })
      .addCase(searchHawanatmakThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteHawanatmakThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteHawanatmakThunk.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedHawanatmak = action.payload;
      })
    .addCase(deleteHawanatmakThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })
    .addCase(getAHawanatmakThunk.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getAHawanatmakThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.hwnName = action.payload.name;
        state.hwnEmail = action.payload.email;
        state.hwnPhone = action.payload.mobile_no;
        state.hwnDate = action.payload.date;
        state.hwnAdhar = action.payload.adhar_no;
        state.hwnMsg = action.payload.message;
    })
    .addCase(getAHawanatmakThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })
     .addCase(getTotalHawBookingsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTotalHawBookingsThunk.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.totalBookings = action.payload.totalBookings;
      })
      .addCase(getTotalHawBookingsThunk.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })

      .addCase(resetState, () => initialState);
  },
});

export default hawanatmakSlice.reducer;