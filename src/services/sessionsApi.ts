import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../api/baseQuery";
import { Session, SessionData, Seat } from "../types/authTypes";

export interface SessionPayload {
  dateTime: string;
  price: number;
  seats: Pick<Seat, "seatNumber" | "isBooked">[];
}

export interface AddSessionArgs {
  movieId: number;
  session: SessionPayload;
}

export interface RemoveSessionArgs {
  movieId: number;
  sessionId: string;
}

export interface UpdateSessionArgs {
  movieId: number;
  sessionId: string;
  session: SessionPayload;
}

export const sessionsApi = createApi({
  reducerPath: "sessionsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Sessions"],
  endpoints: (builder) => ({

    getSessionsByDate: builder.query<
      SessionData[],
      { movieId: string; date: string }
    >({
      query: ({ movieId, date }) =>
        `/movies-in-cinema/${movieId}/sessions?date=${date}`,
      providesTags: ["Sessions"],
    }),

    getSingleSession: builder.query<
      Session,
      { movieId: string; sessionId: string }
    >({
      query: ({ movieId, sessionId }) =>
        `/movies-in-cinema/${movieId}/sessions/${sessionId}`,
    }),

    addSession: builder.mutation<void, AddSessionArgs>({
      query: ({ movieId, session }) => ({
        url: `/movies-in-cinema/${movieId}/sessions`,
        method: "POST",
        body: session,
      }),
      invalidatesTags: ["Sessions"],
    }),

    removeSession: builder.mutation<void, RemoveSessionArgs>({
      query: ({ movieId, sessionId }) => ({
        url: `/movies-in-cinema/${movieId}/sessions/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sessions"],
    }),

    updateSession: builder.mutation<void, UpdateSessionArgs>({
      query: ({ movieId, sessionId, session }) => ({
        url: `/movies-in-cinema/${movieId}/sessions/${sessionId}`,
        method: "PUT",
        body: session,
      }),
      invalidatesTags: ["Sessions"],
    }),

  }),
});

export const {
  useGetSessionsByDateQuery,
  useGetSingleSessionQuery,
  useAddSessionMutation,
  useRemoveSessionMutation,
  useUpdateSessionMutation,
} = sessionsApi;