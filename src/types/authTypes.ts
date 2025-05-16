import { StatusEnum } from "../utils/EnumsFile";

export interface AuthState {
  token: string | null;
  error: string | null;
  status: StatusEnum;
}

export interface ErrorResponse {
  loginOrEmail?: string;
  password?: string;
}

export interface AuthFormProps {
  handleClose: () => void;
  onSwitchMode?: () => void;
}

export interface LoginPayload {
  loginOrEmail: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface Session {
  sessionId?: number;
  dateTime: string;
  price: number;
  seats: Seat[];
  _id: string;
}
export interface SessionData {
  session: {
    dateTime: string;
    price: number;
    seats: Seat[];
    _id: string;
  };
}

export interface Seat {
  seatNumber: number;
  isBooked: boolean;
  _id: string;
}
export interface Movie {
  _id: string;
  movieId: number;
  sessions: Session[];
  tmdbDetails: {
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    runtime: number;
    genres: { id: number; name: string }[];
    videos: { key: string; type: string; site: string };
  };
}
