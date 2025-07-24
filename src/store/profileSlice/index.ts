import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../api/apiClient";

type User = {
  email: string;
  password: string;
  newPassword?: string;
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

export const fetchProfile = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("profile/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("customers/customer");
    return Array.isArray(res.data) ? res.data : [res.data];
  } catch (e) {
    console.error(e);
    return rejectWithValue("Failed to fetch profile");
  }
});

export const updatePassword = createAsyncThunk<
  User[],
  { password: string; newPassword: string },
  { rejectValue: string }
>(
  "profile/updatePassword",
  async ({ password, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axios.put("/customers/password", {
        password,
        newPassword,
      });
      return Array.isArray(res.data) ? res.data : [res.data];
    } catch (e) {
      console.error(e);
      return rejectWithValue(String(e));
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updatePasswordLocaly: (
      state,
      action: PayloadAction<{ newPassword: string }>
    ) => {
      if (state.user.length > 0) {
        state.user[0].password = action.payload.newPassword;
      }
    },
  },
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
        state.error = action.error.message || "Failed to fetch profile";
      });
  },
});

export default profileSlice.reducer;
export const { updatePasswordLocaly } = profileSlice.actions;
