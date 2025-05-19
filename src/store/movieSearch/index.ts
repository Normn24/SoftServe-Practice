import axios from "../../api/apiClient";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../../types/authTypes";
import { StatusEnum } from "../../utils/EnumsFile";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";

export interface MoviesState {
  movieSearch: Movie[];
  status:
    | StatusEnum.IDLE
    | StatusEnum.LOADING
    | StatusEnum.SUCCEEDED
    | StatusEnum.FAILED;
  error: string | null;
  currentQuery: string;
}

const initialState: MoviesState = {
  movieSearch: [],
  status: StatusEnum.LOADING,
  error: null,
  currentQuery: "",
};

export const searchMovies = createAsyncThunk(
  "movieSearch/searchMovies",
  async (query: string, { rejectWithValue }) => {
    if (!query.trim()) {
      return [];
    }
    try {
      const response = await axios.get(`/movies-in-cinema?title=${query}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

const movieSearch = createSlice({
  name: "movieSearch",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.movieSearch = [];
      state.status = StatusEnum.IDLE;
      state.error = null;
      state.currentQuery = "";
    },
    setCurrentQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.movieSearch = action.payload;
        state.status = StatusEnum.SUCCEEDED;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.status = StatusEnum.FAILED;
        state.movieSearch = [];
        state.error = action.payload as string;
      });
  },
});

export const { clearSearchResults, setCurrentQuery } = movieSearch.actions;
export default movieSearch.reducer;
