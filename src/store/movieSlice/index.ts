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
  async (movieId) => {
    const response = await axios.get(`movies-in-cinema/${movieId}`);
    const data = response.data;
    const movie: Movie = {
      id: data.tmdbDetails.id,
      title: data.tmdbDetails.title,
      overview: data.tmdbDetails.overview,
      release_date: data.tmdbDetails.release_date,
      runtime: data.tmdbDetails.runtime,
      poster_path: data.tmdbDetails.poster_path,
      backdrop_path: data.tmdbDetails.backdrop_path,
      original_language: data.tmdbDetails.original_language,
      original_title: data.tmdbDetails.original_title,
      popularity: data.tmdbDetails.popularity,
      vote_average: data.tmdbDetails.vote_average,
      vote_count: data.tmdbDetails.vote_count,
      adult: data.tmdbDetails.adult,
      genres: data.tmdbDetails.genres,
      origin_country: data.tmdbDetails.origin_country,
      production_companies: data.tmdbDetails.production_companies.map(
        (company: ProductionCompany) => ({
          id: company.id,
          name: company.name,
          logo_path: company.logo_path,
        })
      ),
      spoken_languages: data.tmdbDetails.spoken_languages.map(
        (lang: { english_name: string }) => lang.english_name
      ),
      recommendations: data.tmdbDetails.recommendations,
      videos: data.tmdbDetails.videos,
      cast: data.tmdbDetails.cast,
      sessions: data.sessions,
      tagline: data.tmdbDetails.tagline || "",
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
