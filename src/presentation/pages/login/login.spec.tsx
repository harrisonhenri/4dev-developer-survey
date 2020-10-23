import React from 'react'
import { render, RenderResult, fireEvent, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy, SaveAccessTokenMock, Helper } from '@/presentation/test'
import faker from 'faker'
import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  errorMessage: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  validationStub.errorMessage = params?.errorMessage
  const sut = render(
    <Router history={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )

  return {
    sut,
    authenticationSpy,
    saveAccessTokenMock
  }
}

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.email()): Promise<void> => {
  Helper.populateField(sut, 'email', email)

  Helper.populateField(sut, 'password', password)

  const form = sut.getByTestId('form')

  fireEvent.submit(form)

  await waitFor(() => form)
}

const testFormStatusChild = (sut: RenderResult, count: number): void => {
  const formStatus = sut.getByTestId('form-status')

  expect(formStatus.childElementCount).toBe(count)
}

describe('Login', () => {
  test('should start with initial state', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })
    const { getByRole } = sut
    const submitButton = getByRole('button') as HTMLButtonElement

    expect(submitButton.disabled).toBe(true)
    Helper.testStatusForField(sut, 'email', errorMessage)
    Helper.testStatusForField(sut, 'password', errorMessage)
    testFormStatusChild(sut, 0)
  })

  test('should show email error if Validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })

    Helper.populateField(sut, 'email')

    Helper.testStatusForField(sut, 'email', errorMessage)
  })

  test('should show password error if Validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })

    Helper.populateField(sut, 'password')

    Helper.testStatusForField(sut, 'password', errorMessage)
  })

  test('should show validate email state if Validation succeeds', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'email')

    Helper.testStatusForField(sut, 'email')
  })

  test('should show validate password state if Validation succeeds', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'password')

    Helper.testStatusForField(sut, 'password')
  })

  test('should enable submit button if Validation succeeds', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')
    const submitButton = sut.getByRole('button') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    const email = faker.internet.email()

    const password = faker.internet.password()

    await simulateValidSubmit(sut, email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()

    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', async () => {
    const errorMessage = faker.random.words()

    const { sut, authenticationSpy } = makeSut({ errorMessage })

    await simulateValidSubmit(sut)

    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()

    const error = new InvalidCredentialsError()

    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    await simulateValidSubmit(sut)

    Helper.testTextContent(sut, 'main-error', error.message)
    testFormStatusChild(sut, 1)
  })

  test('should add accessToken to SaveAccessToken on sucess', async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut()

    await simulateValidSubmit(sut)

    expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to sign up page', async () => {
    const { sut } = makeSut()

    const signup = sut.getByTestId('signup')

    fireEvent.click(signup)

    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })

  test('should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut()

    const error = new InvalidCredentialsError()

    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error)

    await simulateValidSubmit(sut)

    Helper.testTextContent(sut, 'main-error', error.message)
    testFormStatusChild(sut, 1)
  })
})
