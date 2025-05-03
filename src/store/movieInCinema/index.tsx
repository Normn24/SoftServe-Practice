import axios from "../../api/apiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Movie } from "../../types/authTypes";
import { StatusEnum } from "../../utils/EnumsFile";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";

interface MoviesState {
  movieInCinema: Movie[];
  status:
    | StatusEnum.IDLE
    | StatusEnum.LOADING
    | StatusEnum.SUCCEEDED
    | StatusEnum.FAILED;
  error: string | null;
  alert: {
    message: string;
    status: StatusEnum.SUCCESS | StatusEnum.ERROR;
  } | null;
}

const initialState: MoviesState = {
  movieInCinema: [],
  status: StatusEnum.IDLE,
  error: null,
  alert: null,
};

export const fetchMovies = createAsyncThunk(
  "movieInCinema/fetchMovies",
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

const movieInCinema = createSlice({
  name: "movieInCinema",
  initialState,
  reducers: {
    setAlert: (state, { payload }) => {
      state.alert = payload;
    },
    clearAlert: (state) => {
      state.alert = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.movieInCinema = action.payload;
        state.status = StatusEnum.SUCCEEDED;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = StatusEnum.FAILED;
        state.error = action.payload as string;
      });
  },
});

export const { setAlert, clearAlert } = movieInCinema.actions;

export default movieInCinema.reducer;
