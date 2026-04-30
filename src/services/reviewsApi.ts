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
  movieTitle: string;
  ticketId: string;
  ratings: Ratings;
  comment: string;
  averageRating: number;
  createdAt: string;
}

export interface CreateReviewPayload {
  movieId: number;
  movieTitle: string;
  ticketId: string;
  ratings: Ratings;
  comment: string;
}

export interface CheckReviewResponse {
  exists: boolean;
  reviewId: string | null;
}

export interface ReviewStats {
  count: number;
  avgRating: number;
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

    getUserReviewStats: builder.query<ReviewStats, void>({
      query: () => "/reviews/me/stats",
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

    updateReview: builder.mutation<Review, { reviewId: string; ratings?: Partial<Ratings>; comment?: string; movieId?: number; ticketId?: string }>({
      query: ({ reviewId, ...body }) => ({
        url: `/reviews/${reviewId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { movieId, ticketId }) => {
        const tags: Array<"UserReviews" | { type: "Reviews"; id: string | number }> = ["UserReviews"];
        if (movieId) tags.push({ type: "Reviews", id: movieId });
        if (ticketId) tags.push({ type: "Reviews", id: ticketId });
        return tags;
      },
    }),

    deleteReview: builder.mutation<void, { reviewId: string; movieId?: number; ticketId?: string }>({
      query: ({ reviewId }) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { movieId, ticketId }) => {
        const tags: Array<"UserReviews" | { type: "Reviews"; id: string | number }> = ["UserReviews"];
        if (movieId) tags.push({ type: "Reviews", id: movieId });
        if (ticketId) tags.push({ type: "Reviews", id: ticketId });
        return tags;
      },
    }),

  }),
});

export const {
  useGetMovieReviewsQuery,
  useGetUserReviewsQuery,
  useGetUserReviewStatsQuery,
  useCheckReviewExistsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;