export interface GeneralModel{
  success: boolean,
  type: string,
  messages: {
    [key: string]: string
  },
  data: object,
  status: number
}
