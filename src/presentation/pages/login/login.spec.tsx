import React from 'react'
import faker from 'faker'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { Login } from '@/presentation/pages'
import { ValidationStub, Helper } from '@/presentation/test'
import { AuthenticationSpy } from '@/domain/test'
import { InvalidCredentialsError } from '@/domain/errors'
import { ApiContext } from '@/presentation/contexts/'
import { Authentication } from '@/domain/usecases'

type SutTypes = {
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: Authentication.Model) => void
}

type SutParams = {
  errorMessage: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const setCurrentAccountMock = jest.fn()
  validationStub.errorMessage = params?.errorMessage
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <Login
          validation={validationStub}
          authentication={authenticationSpy}
        />
      </Router>
    </ApiContext.Provider>
  )

  return {
    authenticationSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (email = faker.internet.email(), password = faker.internet.email()): Promise<void> => {
  Helper.populateField('email', email)

  Helper.populateField('password', password)

  const form = screen.getByTestId('form')

  fireEvent.submit(form)

  await waitFor(() => form)
}

describe('Login', () => {
  test('should start with initial state', () => {
    const errorMessage = faker.random.words()
    makeSut({ errorMessage })
    expect(screen.getByRole('button') as HTMLButtonElement).toBeDisabled()
    Helper.testStatusForField('email', errorMessage)
    Helper.testStatusForField('password', errorMessage)
    expect(screen.getByTestId('form-status').children).toHaveLength(0)
  })

  test('should show email error if Validation fails', () => {
    const errorMessage = faker.random.words()
    makeSut({ errorMessage })

    Helper.populateField('email')

    Helper.testStatusForField('email', errorMessage)
  })

  test('should show password error if Validation fails', () => {
    const errorMessage = faker.random.words()
    makeSut({ errorMessage })

    Helper.populateField('password')

    Helper.testStatusForField('password', errorMessage)
  })

  test('should show validate email state if Validation succeeds', () => {
    makeSut()

    Helper.populateField('email')

    Helper.testStatusForField('email')
  })

  test('should show validate password state if Validation succeeds', () => {
    makeSut()

    Helper.populateField('password')

    Helper.testStatusForField('password')
  })

  test('should enable submit button if Validation succeeds', () => {
    makeSut()

    Helper.populateField('email')
    Helper.populateField('password')
    expect(screen.getByRole('button') as HTMLButtonElement).toBeEnabled()
  })

  test('should call Authentication with correct values', async () => {
    const { authenticationSpy } = makeSut()

    const email = faker.internet.email()

    const password = faker.internet.password()

    await simulateValidSubmit(email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('should call Authentication only once', async () => {
    const { authenticationSpy } = makeSut()

    await simulateValidSubmit()
    await simulateValidSubmit()

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', async () => {
    const errorMessage = faker.random.words()

    const { authenticationSpy } = makeSut({ errorMessage })

    await simulateValidSubmit()

    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut()

    const error = new InvalidCredentialsError()

    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)

    await simulateValidSubmit()

    expect(screen.getByTestId('main-error')).toHaveTextContent(error.message)
    expect(screen.getByTestId('form-status').children).toHaveLength(1)
  })

  test('should add accessToken to UpdateCurrentAccount on sucess', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut()

    await simulateValidSubmit()

    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to sign up page', async () => {
    makeSut()

    const signup = screen.getByTestId('signup')

    fireEvent.click(signup)

    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
