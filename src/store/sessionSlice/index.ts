import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../api/apiClient";
import { StatusEnum } from "../../utils/EnumsFile";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";
import { number } from "yup";

interface Session {
  sessionId?: number;
  dateTime: string;
  price: number;
  seats: number[]; 
}



interface UpdatedSession {
  sessionId?: number;
  dateTime: string;
  price: number;
  seats: {
    seatNumber: number;
    isBooked: boolean;
  }[];
};


interface SessionState {
    sessions: Session[];
    status:
    | StatusEnum.IDLE
    | StatusEnum.LOADING
    | StatusEnum.SUCCEEDED
    | StatusEnum.FAILED;
    error: string | null;
    movie: any;
}

const initialState: SessionState = {
    sessions: [],
    status: StatusEnum.LOADING,
    error: null,
    movie: []
}


export const addSessions = createAsyncThunk(
    "sessions/addSessions",
    async ({ movieId, session }: { movieId: number; session: Session }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`/movies-in-cinema/${movieId}/sessions`, session);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        return rejectWithValue(axiosError.response?.data);
      }
    }
);

export const removeSessions = createAsyncThunk(
  "sessions/removeSessions",
  async ({movieId, sessionId}: {movieId: number; sessionId: number}, { rejectWithValue }) => {
    try {
      const resposne = await axios.delete(`/movies-in-cinema/${movieId}/sessions/${sessionId}`);
      return resposne.data;

    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data);
    }
  }
)

export const updateSessions = createAsyncThunk(
  'sessions/updateSessions',
  async ({movieId, sessionId, session}: {movieId: number, sessionId: number, session: UpdatedSession}, {rejectWithValue}) => {
    try {
      const response = await axios.put(`/movies-in-cinema/${movieId}/sessions/${sessionId}`, session)
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(axiosError.response?.data);
    }
  }
)

  

const sessionSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {
        addSession: (state, action: PayloadAction<Session>) => {
            state.sessions.push(action.payload);
        },
        removeSession: (state, action: PayloadAction<number>) => {
            state.sessions = state.sessions.filter((session) => session.sessionId !== action.payload);
        },
        setSession: (state, action: PayloadAction<Session[]>) => {
            state.sessions = action.payload;
        },
        updateSession: (state, action: PayloadAction<Session>) => {
          const updatedSession = action.payload;
          const index = state.sessions.findIndex((session) => session.sessionId === updatedSession.sessionId);

          if (index !== -1) {
            state.sessions[index] = updatedSession;
          }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addSessions.pending, (state) => {
                state.status = StatusEnum.LOADING;
            })
            .addCase(addSessions.fulfilled, (state, action) => {
                state.error = null;
                state.movie = action.payload
            })
            .addCase(addSessions.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    }
})


export const {addSession, setSession, removeSession, updateSession} = sessionSlice.actions;
export default sessionSlice.reducer;