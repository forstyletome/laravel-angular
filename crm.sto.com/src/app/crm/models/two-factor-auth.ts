import {User} from './user.service';

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

export interface resend2FAResponse {
  success: {
    type: string,
    messages: string,
    data: {
      success: boolean
    }
  }
}
