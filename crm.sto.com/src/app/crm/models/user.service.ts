export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserRole{
  roles: string[]
}

export interface UserPermission{
  permissions: string[]
}
