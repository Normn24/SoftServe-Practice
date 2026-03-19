import axios from "../../api/apiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StatusEnum } from "../../utils/EnumsFile";
import { ErrorResponse } from "react-router-dom";
import { AxiosError } from "axios";

export interface BookSeatArgs {
  movieId: string;
  sessionId: string;
  seatNumber: number;
}

export interface BookingState {
  bookingStatus: StatusEnum;
  bookingError: string | null;
}

const initialState: BookingState = {
  bookingStatus: StatusEnum.IDLE,
  bookingError: null,
};

export const bookSingleSeat = createAsyncThunk(
  "booking/bookSingleSeat",
  async (
    { movieId, sessionId, seatNumber }: BookSeatArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `/movies-in-cinema/${movieId}/sessions/${sessionId}/book`,
        { seatNumber }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.bookingStatus = StatusEnum.IDLE;
      state.bookingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookSingleSeat.pending, (state) => {
        state.bookingStatus = StatusEnum.LOADING;
        state.bookingError = null;
      })
      .addCase(bookSingleSeat.fulfilled, (state) => {
        state.bookingStatus = StatusEnum.SUCCEEDED;
      })
      .addCase(bookSingleSeat.rejected, (state, action) => {
        state.bookingStatus = StatusEnum.FAILED;
        state.bookingError = action.payload as string;
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
