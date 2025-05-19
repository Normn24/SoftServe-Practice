import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from "../../api/apiClient";
import { FavoriteMovie } from '../../types/authTypes';
/*interface Movie {
  id: number;
  title: string;
  poster: string;
}*/


export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async () => {
    const response = await axios.get<FavoriteMovie[]>(`/favorites`);
    return response.data;
  }
);

export const deleteFavorite = createAsyncThunk(
  'favorites/deleteFavorite',
  async (id: number) => {
    await axios.delete(`/favorites/${id}`);
    return id;
  }
);

interface FavoritesState {
  items: FavoriteMovie[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFavorites.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<FavoriteMovie[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fetch failed';
      })
      .addCase(deleteFavorite.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(movie => movie.movieId !== action.payload);
      });
  },
});

export default favoritesSlice.reducer;
