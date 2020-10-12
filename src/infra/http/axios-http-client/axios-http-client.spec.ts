import AxiosHttpClient from './axios-http-client'
import { mockPostRequest } from '@/data/test'
import { mockAxios, mockHttpResponse } from '@/infra/test'
import faker from 'faker'
import axios from 'axios'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const sut = new AxiosHttpClient()

  const mockedAxios = mockAxios()

  return {
    sut,
    mockedAxios
  }
}

describe('AxiosHttpClient', () => {
  test('should call axios with correct values', async () => {
    const { url, body } = mockPostRequest()

    const { sut, mockedAxios } = makeSut()

    await sut.post({ url, body })

    expect(mockedAxios.post).toHaveBeenCalledWith(url, body)
  })

  test('should return the correct statusCode and body', () => {
    const { sut, mockedAxios } = makeSut()

    const promise = sut.post(mockPostRequest())

    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })

  test('should return the correct statusCode and body on failure', () => {
    const { sut, mockedAxios } = makeSut()

    mockedAxios.post.mockRejectedValue({
      response: mockHttpResponse()
    })

    const promise = sut.post(mockPostRequest())

    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
})
