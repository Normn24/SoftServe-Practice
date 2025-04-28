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
  onSignUpClick?: () => void;
  onLoginClick?: () => void;
}

export interface LoginPayload {
  loginOrEmail: string;
  password: string;
}

export interface RegisterPayload {
  loginOrEmail: string;
  password: string;
}

export interface Session {
  dateTime: string;
  price: number;
  seats: any[];
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
  };
}
