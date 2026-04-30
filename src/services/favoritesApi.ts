import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../api/baseQuery";
import { FavoriteMovie } from "../types/authTypes";

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Favorites"],
  endpoints: (builder) => ({
    getFavorites: builder.query<FavoriteMovie[], void>({
      query: () => "/favorites",
      providesTags: ["Favorites"],
    }),
    addFavorite: builder.mutation<void, number>({
      query: (movieId) => ({
        url: `/favorites/${movieId}`,
        method: "POST",
      }),
      invalidatesTags: ["Favorites"],
    }),
    deleteFavorite: builder.mutation<void, number>({
      query: (movieId) => ({
        url: `/favorites/${movieId}`,
        method: "DELETE",
      }),
      onQueryStarted: async (movieId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          favoritesApi.util.updateQueryData("getFavorites", undefined, (draft) => {
            return draft.filter((movie) => movie.id !== movieId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Favorites"],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
} = favoritesApi;