import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/apiClient";
import { AxiosError } from "axios";
import {
  AuthState,
  ErrorResponse,
  LoginPayload,
  RegisterPayload,
} from "../../types/authTypes";
import {
  getTokenFromLocalStorage,
  removeTokenFromLocalStorage,
  setTokenToLocalStorage,
} from "../../utils/TokenUtils";
import { StatusEnum } from "../../utils/EnumsFile";

const initialState: AuthState = {
  token: null,
  error: null,
  status: StatusEnum.LOADING,
};

export const initializeSession = createAsyncThunk(
  "auth/initializeSession",
  async (_, { dispatch }) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      dispatch(setToken(token));
    }
  }
);

export const login = createAsyncThunk<
  string,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (userData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post("customers/login", userData);
    const token = response.data.token;
    dispatch(setToken(token));
    return token;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const errorMessage =
      axiosError.response?.data.password ||
      axiosError.response?.data.loginOrEmail;
    console.log(axiosError.response?.data);
    return rejectWithValue(errorMessage ?? "Login failed");
  }
});

export const registerUser = createAsyncThunk<
  string,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post("customers/", userData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const errorMessage =
      axiosError.response?.data.password ||
      axiosError.response?.data.loginOrEmail;
    console.log(axiosError.response?.data);
    return rejectWithValue(errorMessage ?? "Register failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
      setTokenToLocalStorage(payload);
    },
    clearToken: (state) => {
      removeTokenFromLocalStorage();
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.error = payload || null;
      })
      .addCase(initializeSession.pending, (state) => {
        state.status = StatusEnum.LOADING;
      })
      .addCase(initializeSession.fulfilled, (state) => {
        state.status = StatusEnum.SUCCEEDED;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.error = null;
        state.status = StatusEnum.FULFILLED;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.error = payload || null;
      });
  },
});

export const { setToken, clearToken, clearError } = authSlice.actions;
export default authSlice.reducer;
