import axios from "../../api/apiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Session, SessionData } from "../../types/authTypes";
import { StatusEnum } from "../../utils/EnumsFile";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";

interface SessionState {
  sessions: SessionData[];
  status:
    | StatusEnum.IDLE
    | StatusEnum.LOADING
    | StatusEnum.SUCCEEDED
    | StatusEnum.FAILED;
  error: string | null;
  currentSession: Session | null;
}

const initialState: SessionState = {
  sessions: [],
  status: StatusEnum.IDLE,
  error: null,
  currentSession: null,
};

export const fetchSessions = createAsyncThunk(
  "sessions/fetchSessions",
  async (
    { movieId, query }: { movieId: string; query: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/movies-in-cinema/${movieId}/sessions?date=${query}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

export const fetchSingleSession = createAsyncThunk(
  "sessions/fetchSingleSession",
  async (
    { movieId, sessionId }: { movieId: string; sessionId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/movies-in-cinema/${movieId}/sessions/${sessionId}`
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data || "Failed to fetch session details"
      );
    }
  }
);

const sessions = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    clearSessionsForDate: (state) => {
      state.sessions = [];
      state.status = StatusEnum.LOADING;
      state.error = null;
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
      state.status = StatusEnum.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.sessions = [];
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
        state.status = StatusEnum.SUCCEEDED;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.status = StatusEnum.FAILED;
        state.error = action.payload as string;
      })
      .addCase(fetchSingleSession.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.currentSession = null;
        state.error = null;
      })
      .addCase(fetchSingleSession.fulfilled, (state, action) => {
        state.currentSession = action.payload;
        state.status = StatusEnum.SUCCEEDED;
      })
      .addCase(fetchSingleSession.rejected, (state, action) => {
        state.status = StatusEnum.FAILED;
        state.error = action.payload as string;
      });
  },
});

export const { clearSessionsForDate, clearCurrentSession } = sessions.actions;
export default sessions.reducer;
