import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../api/apiClient";

type User = {
    email: string;
    password: string;
};

type ProfileState = {
    user: User[];
    loading: boolean;
    error: string | null;
};

const initialState: ProfileState = {
    user: [],
    loading: false,
    error: null,
};

export const fetchProfile = createAsyncThunk<User[]>(
    'profile/fetchProfile',
    async () => {
      const apiUrl = 'https://soft-serve-practice-back.vercel.app/api/customers/customer';
      const res = await axios.get(apiUrl);
      return Array.isArray(res.data) ? res.data : [res.data];
      
    }
);


const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
    builder
        .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        })
            .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
        });
    },
});

export default profileSlice.reducer;