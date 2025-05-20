export interface User {
  user:{
    id: number,
    name: string,
    email: string,
  },
  roles: string[],
  permissions: string[]
}

export interface UserRole{
  roles: string[]
}

export interface UserPermission{
  permissions: string[]
}

export interface UserData{
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
