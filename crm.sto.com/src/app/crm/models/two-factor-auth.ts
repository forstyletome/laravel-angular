import {User} from './user.service';

export interface VerifyTwoFactorCodeResponse {
  success: boolean,
  type: string,
  messages: {
    [key: string]: string
  },
  data: {
    user: User['user'],
    roles: User['roles'],
    permissions: User['permissions']
  },
  status: number
}
