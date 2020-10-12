import React from 'react'
import { render, RenderResult, fireEvent, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { Login } from '@/presentation/pages'
import { ValidationStub } from '@/presentation/test'
import faker from 'faker'
import { AuthenticationSpy } from '@/presentation/test/mock-authentication'
import { InvalidCredentialsError } from '@/domain/errors'
import 'jest-localstorage-mock'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  errorMessage: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.errorMessage
  const sut = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy}/>
    </Router>
  )

  return {
    sut,
    authenticationSpy
  }
}

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.email()): Promise<void> => {
  populateEmailField(sut, email)

  populatePasswordField(sut, password)

  const form = sut.getByTestId('form')

  fireEvent.submit(form)

  await waitFor(() => form)
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.email()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)

  expect(fieldStatus.title).toBe(validationError ?? 'Tudo certo!')
}

const testFormStatusChild = (sut: RenderResult, count: number): void => {
  const formStatus = sut.getByTestId('form-status')

  expect(formStatus.childElementCount).toBe(count)
}

const testTextContent = (sut: RenderResult, name: string, text: string): void => {
  const el = sut.getByTestId(name)

  expect(el.textContent).toBe(text)
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should start with initial state', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })
    const { getByRole } = sut
    const submitButton = getByRole('button') as HTMLButtonElement

    expect(submitButton.disabled).toBe(true)
    testStatusForField(sut, 'email', errorMessage)
    testStatusForField(sut, 'password', errorMessage)
    testFormStatusChild(sut, 0)
  })

  test('should show email error if Validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })

    populateEmailField(sut)

    testStatusForField(sut, 'email', errorMessage)
  })

  test('should show password error if Validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })

    populatePasswordField(sut)

    testStatusForField(sut, 'password', errorMessage)
  })

  test('should show validate email state if Validation succeeds', () => {
    const { sut } = makeSut()

    populateEmailField(sut)

    testStatusForField(sut, 'email')
  })

  test('should show validate password state if Validation succeeds', () => {
    const { sut } = makeSut()

    populatePasswordField(sut)

    testStatusForField(sut, 'password')
  })

  test('should enable submit button if Validation succeeds', () => {
    const { sut } = makeSut()

    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    const submitButton = sut.getByRole('button') as HTMLButtonElement

    expect(submitButton.disabled).toBe(false)
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    const email = faker.internet.email()

    const password = faker.internet.email()

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

    jest.spyOn(authenticationSpy, 'auth').mockResolvedValueOnce(Promise.reject(error))

    await simulateValidSubmit(sut)

    testTextContent(sut, 'main-error', error.message)
    testFormStatusChild(sut, 1)
  })

  test('should add accessToken to localStorage on sucess', async () => {
    const { sut, authenticationSpy } = makeSut()

    await simulateValidSubmit(sut)

    expect(localStorage.getItem('accessToken')).toBe(authenticationSpy.account.accessToken)
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
})
