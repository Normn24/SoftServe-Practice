import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../api/baseQuery";

export interface Ratings {
  plot: number;
  acting: number;
  visuals: number;
  sound: number;
  direction: number;
}

export interface Review {
  _id: string;
  movieId: number;
  ticketId: string;
  ratings: Ratings;
  comment: string;
  averageRating: number;
  createdAt: string;
}

export interface CreateReviewPayload {
  movieId: number;
  ticketId: string;
  ratings: Ratings;
  comment: string;
}

export interface CheckReviewResponse {
  exists: boolean;
  reviewId: string | null;
}

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Reviews", "UserReviews"],
  endpoints: (builder) => ({

    getMovieReviews: builder.query<Review[], number>({
      query: (movieId) => `/movies/${movieId}/reviews`,
      providesTags: (_r, _e, movieId) => [{ type: "Reviews", id: movieId }],
    }),

    getUserReviews: builder.query<Review[], void>({
      query: () => "/reviews/me",
      providesTags: ["UserReviews"],
    }),

    checkReviewExists: builder.query<CheckReviewResponse, string>({
      query: (ticketId) => `/reviews/check/${ticketId}`,
      providesTags: (_r, _e, ticketId) => [{ type: "Reviews", id: ticketId }],
    }),

    createReview: builder.mutation<Review, CreateReviewPayload>({
      query: ({ movieId, ...body }) => ({
        url: `/movies/${movieId}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { movieId, ticketId }) => [
        { type: "Reviews", id: movieId },
        { type: "Reviews", id: ticketId },
        "UserReviews",
      ],
    }),

  }),
});

export const {
  useGetMovieReviewsQuery,
  useGetUserReviewsQuery,
  useCheckReviewExistsQuery,
  useCreateReviewMutation,
} = reviewsApi;