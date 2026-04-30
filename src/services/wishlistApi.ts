import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../api/baseQuery";

export interface WishlistItem {
  movieId: number;
  movieTitle: string;
  releaseDate: string;
  addedAt: string;
  hasSessions: boolean;
}

export interface AddToWishlistPayload {
  movieId: number;
  movieTitle: string;
  releaseDate: string;
}

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({

    getWishlist: builder.query<WishlistItem[], void>({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation<void, AddToWishlistPayload>({
      query: (body) => ({
        url: "/wishlist",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation<void, number>({
      query: (movieId) => ({
        url: `/wishlist/${movieId}`,
        method: "DELETE",
      }),
      // Оптимістичне оновлення — прибираємо елемент миттєво
      onQueryStarted: async (movieId, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          wishlistApi.util.updateQueryData("getWishlist", undefined, (draft) =>
            draft.filter((w) => w.movieId !== movieId)
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;