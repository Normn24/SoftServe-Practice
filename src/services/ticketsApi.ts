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

export interface PaginationMeta {
  totalTickets: number;
  totalPages: number;
  currentPage: number;
}

export interface GetTicketsResponse {
  tickets: UserTicket[];
  pagination: PaginationMeta;
}

export interface GetTicketsArgs {
  page: number;
  limit?: number;
  status: "active" | "used" | "all";
}

export interface ValidateTicketResponse {
  valid: boolean;
  message: string;
  ticket: {
    _id: string;
    seatNumber: number;
    movieInCinema: number;
  };
}

export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Tickets"],
  endpoints: (builder) => ({
    getUserTickets: builder.query<GetTicketsResponse, GetTicketsArgs>({
      query: ({ page, limit = 10, status }) => 
        `/tickets/me?page=${page}&limit=${limit}&status=${status}`,
      providesTags: ["Tickets"],
    }),

    deleteTicket: builder.mutation<void, string>({
      query: (ticketId) => ({
        url: `/tickets/${ticketId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tickets"],
    }),

    validateTicket: builder.mutation<ValidateTicketResponse, string>({
      query: (ticketId) => ({
        url: `/tickets/${ticketId}/validate`,
        method: "PUT",
      }),
      invalidatesTags: ["Tickets"],
    }),
  }),
});

export const {
  useGetUserTicketsQuery,
  useDeleteTicketMutation,
  useValidateTicketMutation,
} = ticketsApi;