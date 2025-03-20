export interface ResponseErrors {
  data: {
    [key: string]: any
  },
  messages: {
    [key: string]: string
  },
  type: string,
  status: number
}
