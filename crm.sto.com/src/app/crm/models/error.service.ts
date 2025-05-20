export interface StandardError{
  success: boolean,
  type: string,
  messages: {
    [key: string]: string
  },
  data: object,
  status: number
}

export interface SystemError{
  success: boolean,
  type: string,
  messages: {
    [key: string]: string
  },
  data: {
    type: string
  },
  status: number
}
