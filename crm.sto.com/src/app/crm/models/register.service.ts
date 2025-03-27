export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  policy: boolean;
}

export interface RegisterResponse {
  success:{
    data:{
      success: boolean
    }
  }
}

export interface ForgotPasswordResponse {
  success:{
    messages: {
      [key: string]: string
    },
    data:{
      success: boolean
    }
  }
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  success:{
    messages: {
      [key: string]: string
    },
    data:{
      success: boolean
    }
  }
}

export interface VerifyResponse {
  success:{
    messages: {
      [key: string]: string
    },
    data:{
      success: boolean
    }
  }
}

export interface ResendVerifyEmailResponse {
  success:{
    messages: string,
    data:{
      success: boolean
    }
  }
}
