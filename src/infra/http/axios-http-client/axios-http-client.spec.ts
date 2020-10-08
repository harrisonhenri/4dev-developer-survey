import AxiosHttpClient from './axios-http-client'
import axios from 'axios'
import faker from 'faker'
import { HttpPostParams } from '@/data/protocols/http'
jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

const mockedAxiosResult = {
  data: faker.random.objectElement(),
  status: faker.random.number()
}

mockedAxios.post.mockResolvedValue(mockedAxiosResult)

const makeSut = (url = faker.internet.url()): AxiosHttpClient => {
  return new AxiosHttpClient()
}

const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.objectElement()
})

describe('AxiosHttpClient', () => {
  test('should call axios with correct values', async () => {
    const { url, body } = mockPostRequest()

    const sut = makeSut()

    await sut.post({ url, body })

    expect(mockedAxios.post).toHaveBeenCalledWith(url, body)
  })

  test('should return the correct statusCode and body', async () => {
    const sut = makeSut()

    const httpResponse = await sut.post(mockPostRequest())

    expect(httpResponse).toEqual({
      statusCode: mockedAxiosResult.status,
      body: mockedAxiosResult.data
    })
  })
})
