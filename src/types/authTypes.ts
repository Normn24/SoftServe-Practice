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
