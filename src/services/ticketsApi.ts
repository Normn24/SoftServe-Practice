import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../api/baseQuery";

export interface UserTicket {
  _id: string;
  bookingDate: string;
  seatNumber: number;
  isUsed: boolean;
  movieId: number;
  movieTitle: string | null;
  moviePoster: string | null;
  sessionDateTime: string | null;
  sessionPrice: number | null;
}

export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Tickets"],
  endpoints: (builder) => ({

    getUserTickets: builder.query<UserTicket[], void>({
      query: () => "/tickets/me",
      providesTags: ["Tickets"],
    }),

    deleteTicket: builder.mutation<void, string>({
      query: (ticketId) => ({
        url: `/tickets/${ticketId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tickets"],
    }),

  }),
});

export const {
  useGetUserTicketsQuery,
  useDeleteTicketMutation,
} = ticketsApi;