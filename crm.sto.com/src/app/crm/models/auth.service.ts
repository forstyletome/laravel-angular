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

export interface LogoutResponse {
  success:{
    data:{
      success: boolean
    }
  }
}

/*
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
    messages: {
      [key: string]: string
    },
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
      user: User,
      roles: string[],
      permissions: string[]
    }
  }
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
*/
