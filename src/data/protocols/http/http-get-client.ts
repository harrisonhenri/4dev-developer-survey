export type HttpGetParams = {
  url: string
  body?: any
}

export interface HttpGetClient{
  get: (params: HttpGetParams) => Promise<void>
}
