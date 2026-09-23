import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import livelinkService from "./livelinkService";

export const createLinkThunk = createAsyncThunk(
    "liveLink/create", 
    async(liveData, thunkAPI) => {
        try {
            return await livelinkService.createLive(liveData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
});

export const getAllLiveThunk = createAsyncThunk(
    "liveLink/get-all",
    async (thunkAPI) => {
      try {
        return await livelinkService.getAllLiveLink();
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
);

export const getSinLiveThunk = createAsyncThunk("liveLink/get-single", async(id, thunkAPI) => {
    try {
        return await livelinkService.getSingleLiveLink(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});


export const deleteLiveThunk = createAsyncThunk("liveLink/delete-liveLink", async(id, thunkAPI) => {
    try {
        await livelinkService.deleteLiveLink(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const resetState = createAction("Reset_all");

const initialState = {
    livelinks: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const livelinkSlice = createSlice({
    name: "livelinks",
    initialState: initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(createLinkThunk.pending , (state) => {
            state.isLoading = true;
        })
        .addCase(createLinkThunk.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.doneLive = action.payload;
        })
        .addCase(createLinkThunk.rejected, (state, action) => {
            state.isError = true;
            state.message = action.error;
        })
        .addCase(getAllLiveThunk.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAllLiveThunk.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.liveLink = action.payload;
        })
        .addCase(getAllLiveThunk.rejected,(state, action) => {
            state.message = action.error;
            state.isError = true;
        })
        .addCase(getSinLiveThunk.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getSinLiveThunk.fulfilled, (state, action) => {
            state.isSuccess = true;
            state.liveLink = action.payload.link;
        })
        .addCase(getSinLiveThunk.rejected, (state, action) => {
            state.isError = true;
            state.message = action.error;
        })
        .addCase(deleteLiveThunk.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteLiveThunk.fulfilled, (state,action) => {
            state.isSuccess = true;
            state.deletedLive = action.payload;
        })
        .addCase(deleteLiveThunk.rejected, (state, action) => {
            state.isError = true;
            state.message = action.error;
        })
        .addCase(resetState, () => initialState);
    }
})

export default livelinkSlice.reducer;