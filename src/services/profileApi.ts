import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../api/baseQuery";

export type User = {
  email: string;
  password?: string;
  newPassword?: string;
};

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query<User[], void>({
      query: () => "/customers/customer",
      transformResponse: (res: unknown) => (Array.isArray(res) ? res as User[] : [res] as User[]),
      providesTags: ["Profile"],
    }),
    updatePassword: builder.mutation<User[], { password: string; newPassword: string }>({
      query: (body) => ({
        url: "/customers/password",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdatePasswordMutation } = profileApi;
