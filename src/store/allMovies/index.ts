import axios from "../../api/apiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Movie } from "../../types/authTypes";
import { StatusEnum } from "../../utils/EnumsFile";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";

interface AllMovies {
  allMovie: Movie[];
  status:
    | StatusEnum.IDLE
    | StatusEnum.LOADING
    | StatusEnum.SUCCEEDED
    | StatusEnum.FAILED;
  error: string | null;
}

const initialState: AllMovies = {
  allMovie: [],
  status: StatusEnum.LOADING,
  error: null,
};

export const fetchAllMovies = createAsyncThunk(
  "allMovie/fetchAllMovies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/movies-in-cinema");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

const allMovie = createSlice({
  name: "allMovie",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMovies.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.error = null;
      })
      .addCase(fetchAllMovies.fulfilled, (state, action) => {
        state.allMovie = action.payload;
        state.status = StatusEnum.SUCCEEDED;
      })
      .addCase(fetchAllMovies.rejected, (state, action) => {
        state.status = StatusEnum.FAILED;
        state.error = action.payload as string;
      });
  },
});

export default allMovie.reducer;
