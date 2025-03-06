export interface AuthResponse {
  errors: string[],
  data:{
    authenticated: boolean;
    userId: number;
  }
}

export interface LoginResponse {
  errors: string[],
  message: string[],
  data: {
    user_id: number
  }
}

export interface RegisterResponse {
  success: boolean,
  data: {
    id: number
  },
  errors: string[]
}

export interface VerifyResponse {
  message: string;
}

export interface resend2FAResponse {
  message: string;
}

export interface LogoutResponse {

}

export interface ResetPasswordResponse {
  errors:string[],
  message: string[],
  status: boolean,
  email: string,
  token: string
}

export interface ForgotPasswordResponse {
  email: string;
  status: boolean;
}

export interface VerifyTwoFactorCodeResponse {
  message: string;
  authenticated: boolean;
  userId: number;
}

export interface GetUserResponse {
  id: number,
  name: string,
  email: string
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  policy: boolean;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
