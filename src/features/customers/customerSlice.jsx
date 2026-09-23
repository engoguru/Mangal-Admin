import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import customerService from './customerService';


export const getUsers = createAsyncThunk('customer/get-customers', async (thunkAPI) => {
    try {
        return await customerService.getUsers();
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const deleteUserThunk = createAsyncThunk(
    "user/delete-user",
    async (id, thunkAPI) => {
      try {
        return await customerService.deleteUser(id);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

const initialState = {
    customers: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

export const customerSlice = createSlice({
    name: "users",
    initialState: initialState,
    reducers: {} ,
    extraReducers: (builder) => {
            builder.addCase(getUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.isSuccess = true;
                state.customers = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.isSuccess = false;
                state.message = action.error;
            })
            .addCase(deleteUserThunk.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(deleteUserThunk.fulfilled, (state, action) => {
                  state.isLoading = false;
                  state.isError = false;
                  state.isSuccess = true;
                  state.deletedAbhishek = action.payload;
              })
            .addCase(deleteUserThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.error;
            })
    },
});

export default customerSlice.reducer;