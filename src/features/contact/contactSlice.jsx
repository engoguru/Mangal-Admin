import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import contactService from './contactService';

export const getAllContacts = createAsyncThunk(
  "contact/getAll",
  async ({ page = 1, limit = 10, search = "" }, thunkAPI) => {
    try {
      return await contactService.getAllContact(page, limit, search);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const searchContacts = createAsyncThunk(
  'contact/search',
  async (query, thunkAPI) => {
    try {
      return await contactService.searchContact(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteContactThunk = createAsyncThunk(
  "contact/delete-contact",
  async (id, thunkAPI) => {
    try {
      return await contactService.deleteContact(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAContactThunk = createAsyncThunk(
  "contact/get-contact",
  async (id, thunkAPI) => {
    try {
      return await contactService.getSingleContact(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
    contacts: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

const contactSlice = createSlice({
  name: 'contact',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllContacts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.contact = action.payload;
      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(searchContacts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchContacts.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.contact = action.payload;
      })
      .addCase(searchContacts.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(deleteContactThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteContactThunk.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.deletedAbhishek = action.payload;
      })
    .addCase(deleteContactThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })
    .addCase(getAContactThunk.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getAContactThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.conName = action.payload.name;
        state.conPhone = action.payload.phone;
        state.conEmail = action.payload.email;
        state.conMsg = action.payload.message;
    })
    .addCase(getAContactThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
    })

      .addCase(resetState, () => initialState);
  },
});

export default contactSlice.reducer;