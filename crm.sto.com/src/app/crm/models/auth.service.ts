export interface LoginResponse {
  data: {
    showHideResendLink: boolean
  },
  messages: {
    [key: string]: string
  },
  status: number,
  type: string,
  success: boolean
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
