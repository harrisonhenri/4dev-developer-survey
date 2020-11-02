import AxiosHttpClient from './axios-http-client'
import { mockGetRequest, mockPostRequest } from '@/data/test'
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
  describe('post', () => {
    test('should call axios.post with correct values', async () => {
      const { url, body } = mockPostRequest()

      const { sut, mockedAxios } = makeSut()

      await sut.post({ url, body })

      expect(mockedAxios.post).toHaveBeenCalledWith(url, body)
    })

    test('should return correct response on axios.post', async () => {
      const { sut, mockedAxios } = makeSut()

      const httpResponse = await sut.post(mockPostRequest())
      const axiosResponse = await mockedAxios.post.mock.results[0].value

      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data
      })
    })

    test('should return the correct error on axios.post', () => {
      const { sut, mockedAxios } = makeSut()

      mockedAxios.post.mockRejectedValue({
        response: mockHttpResponse()
      })

      const promise = sut.post(mockPostRequest())

      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })
  })
  describe('get', () => {
    test('should call axios.get with correct values', async () => {
      const { url, headers } = mockGetRequest()

      const { sut, mockedAxios } = makeSut()

      await sut.get({ url, headers })

      expect(mockedAxios.get).toHaveBeenCalledWith(url, {
        headers
      })
    })

    test('should return correct response on axios.get', async () => {
      const { sut, mockedAxios } = makeSut()

      const httpResponse = await sut.get(mockGetRequest())
      const axiosResponse = await mockedAxios.get.mock.results[0].value

      expect(httpResponse).toEqual({
        statusCode: axiosResponse.status,
        body: axiosResponse.data
      })
    })

    test('should return the correct error on axios.get', () => {
      const { sut, mockedAxios } = makeSut()

      mockedAxios.get.mockRejectedValue({
        response: mockHttpResponse()
      })

      const promise = sut.get(mockGetRequest())

      expect(promise).toEqual(mockedAxios.get.mock.results[0].value)
    })
  })
})
