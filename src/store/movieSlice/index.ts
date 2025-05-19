import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../api/apiClient";
import { Movie, ProductionCompany } from "../../types/movieTypes";

interface MovieState {
  movie: Movie | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movie: null,
  loading: false,
  error: null,
};

export const fetchMovie = createAsyncThunk<Movie, number>(
  "movies/fetchMovie",
  async (movieId, { rejectWithValue }) => {
    const response = await axios.get(`movies/${movieId}`);
    const data = response.data;
    const movie: Movie = {
      id: data.id,
      title: data.title,
      overview: data.overview,
      release_date: data.release_date,
      runtime: data.runtime,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      original_language: data.original_language,
      original_title: data.original_title,
      popularity: data.popularity,
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      adult: data.adult,
      genres: data.genres,
      origin_country: data.origin_country,
      production_companies: data.production_companies.map(
        (company: ProductionCompany) => ({
          id: company.id,
          name: company.name,
          logo_path: company.logo_path,
        })
      ),
      spoken_languages: data.spoken_languages.map(
        (lang: { english_name: string }) => lang.english_name
      ),
      recommendations: data.recommendations,
      videos: data.videos.key,
      cast: data.cast,
    };
    return movie;
  }
);

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    clearMovie(state) {
      state.movie = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.movie = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMovie } = movieSlice.actions;
export default movieSlice.reducer;
