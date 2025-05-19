import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../api/apiClient";
import { StatusEnum } from "../../utils/EnumsFile";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";
import { Session } from "../../types/authTypes";

// interface Session {
//   sessionId?: number;
//   dateTime: string;
//   price: number;
//   seats: number[];
// }

interface UpdatedSession {
  sessionId?: number;
  dateTime: string;
  price: number;
  seats: {
    seatNumber: number;
    isBooked: boolean;
  }[];
}

interface SessionState {
  sessions: Session[];
  status:
    | StatusEnum.IDLE
    | StatusEnum.LOADING
    | StatusEnum.SUCCEEDED
    | StatusEnum.FAILED;
  error: string | null;
  currentSession: Session | null;
  movie: any;
}

const initialState: SessionState = {
  sessions: [],
  status: StatusEnum.LOADING,
  error: null,
  currentSession: null,
  movie: [],
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

export const addSessions = createAsyncThunk(
  "sessions/addSessions",
  async (
    { movieId, session }: { movieId: number; session: Session },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `/movies-in-cinema/${movieId}/sessions`,
        session
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

export const removeSessions = createAsyncThunk(
  "sessions/removeSessions",
  async (
    { movieId, sessionId }: { movieId: number; sessionId: number },
    { rejectWithValue }
  ) => {
    try {
      const resposne = await axios.delete(
        `/movies-in-cinema/${movieId}/sessions/${sessionId}`
      );
      return resposne.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

export const updateSessions = createAsyncThunk(
  "sessions/updateSessions",
  async (
    {
      movieId,
      sessionId,
      session,
    }: { movieId: number; sessionId: number; session: UpdatedSession },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `/movies-in-cinema/${movieId}/sessions/${sessionId}`,
        session
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data);
    }
  }
);

const sessionSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    addSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload);
    },
    removeSession: (state, action: PayloadAction<number>) => {
      state.sessions = state.sessions.filter(
        (session) => session.sessionId !== action.payload
      );
    },
    setSession: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload;
    },
    updateSession: (state, action: PayloadAction<Session>) => {
      const updatedSession = action.payload;
      const index = state.sessions.findIndex(
        (session) => session.sessionId === updatedSession.sessionId
      );

      if (index !== -1) {
        state.sessions[index] = updatedSession;
      }
    },
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
      })
      .addCase(addSessions.pending, (state) => {
        state.status = StatusEnum.LOADING;
      })
      .addCase(addSessions.fulfilled, (state, action) => {
        state.error = null;
        state.movie = action.payload;
      })
      .addCase(addSessions.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { addSession, setSession, removeSession, updateSession } =
  sessionSlice.actions;
export default sessionSlice.reducer;
