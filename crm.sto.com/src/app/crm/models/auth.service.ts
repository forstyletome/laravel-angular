export interface LoginResponse {
  success: {
    type: string,
    messages: {
      [key: string]: string
    },
    data: {
      success: boolean
    }
  }
}

export interface resend2FAResponse {
  success: {
    type: string,
    messages: string,
    data: {
      success: boolean
    }
  }
}

export interface LogoutResponse {
  success:{
    data:{
      success: boolean
    }
  }
}

export interface UserRole{
  roles: string[]
}

export interface UserPermission{
  permissions: string[]
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

export interface ForgotPasswordResponse {
  success:{
    data:{
      success: boolean
    }
  }
}

export interface VerifyTwoFactorCodeResponse {
  success: {
    type: string,
    messages: {
      [key: string]: string
    },
    data: {
      user: {
        id: number,
        name: string,
        email: string
      },
      roles: string[],
      permissions: string[]
    }
  }
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
