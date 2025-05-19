import axios from "../../api/apiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Movie } from "../../types/authTypes";
import { StatusEnum } from "../../utils/EnumsFile";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";

interface MoviesState {
  moviesUpComming: Movie[];
  status:
    | StatusEnum.IDLE
    | StatusEnum.LOADING
    | StatusEnum.SUCCEEDED
    | StatusEnum.FAILED;
  error: string | null;
}

const initialState: MoviesState = {
  moviesUpComming: [],
  status: StatusEnum.LOADING,
  error: null,
};

export const fetchNewMovies = createAsyncThunk(
  "moviesUpComming/fetchNewMovies",
  async (page: number, { rejectWithValue }) => {  // Додаємо параметр page
    try {
      const response = await axios.get(`/movies-in-cinema?status=comingSoon&page=${page}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data);
    }
  }
);


const moviesUpComming = createSlice({
  name: "moviesUpComming",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewMovies.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.error = null;
      })
      .addCase(fetchNewMovies.fulfilled, (state, action) => {
        state.moviesUpComming = action.payload;
        state.status = StatusEnum.SUCCEEDED;
      })
      .addCase(fetchNewMovies.rejected, (state, action) => {
        state.status = StatusEnum.FAILED;
        state.error = action.payload as string;
      });
  },
});

export default moviesUpComming.reducer;
