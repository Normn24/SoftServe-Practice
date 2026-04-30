import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../api/baseQuery";
import { Session, SessionData, Seat } from "../types/authTypes";
import { ticketsApi } from "./ticketsApi";

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

export interface BookSeatArgs {
  movieId: string;
  sessionId: string;
  seatNumber: number;
}

export const sessionsApi = createApi({
  reducerPath: "sessionsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Sessions", "SingleSession"],
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
      providesTags: (_result, _error, { sessionId }) => [
        { type: "SingleSession", id: sessionId },
      ],
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

    bookSeat: builder.mutation<void, BookSeatArgs>({
      query: ({ movieId, sessionId, seatNumber }) => ({
        url: `/movies-in-cinema/${movieId}/sessions/${sessionId}/book`,
        method: "POST",
        body: { seatNumber },
      }),
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: "SingleSession", id: sessionId },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(ticketsApi.util.invalidateTags(["Tickets"]));
        } catch (e) {
          console.error("❌ onQueryStarted error:", e);
        }
      },
    }),

  }),
});

export const {
  useGetSessionsByDateQuery,
  useGetSingleSessionQuery,
  useAddSessionMutation,
  useRemoveSessionMutation,
  useUpdateSessionMutation,
  useBookSeatMutation,
} = sessionsApi;