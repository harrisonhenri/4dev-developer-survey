import { RemoteAddAccount } from './remote-add-account'
import { HttpPostClientSpy } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { mockAccountModel, mockAddAccountParams } from '@/domain/test'
import { EmailInUseError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'

type SutTypes={
  sut: RemoteAddAccount
  httpPostClientSpy: HttpPostClientSpy<RemoteAddAccount.Model>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<RemoteAddAccount.Model>()

  const sut = new RemoteAddAccount(url, httpPostClientSpy)

  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAddAccount', () => {
  test('should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()

    const { sut, httpPostClientSpy } = makeSut(url)

    await sut.add(mockAddAccountParams())

    expect(httpPostClientSpy.url).toBe(url)
  })

  test('should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)

    expect(httpPostClientSpy.body).toEqual(addAccountParams)
  })

  test('should throw EmailInUse if HttpPostClient returns 401', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow(new EmailInUseError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('should return AddAccount.Model if HttpPostClient returns 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    const body = mockAccountModel()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body
    }

    const account = await sut.add(mockAddAccountParams())

    await expect(account).toEqual(body)
  })
})
