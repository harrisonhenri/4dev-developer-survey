import React from 'react'
import { render, RenderResult, fireEvent } from '@testing-library/react'
import Login from './login'
import { ValidationStub } from '@/presentation/test'
import faker from 'faker'
import { AuthenticationSpy } from '@/presentation/test/mock-authentication'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  errorMessage: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.errorMessage
  const sut = render(<Login validation={validationStub} authentication={authenticationSpy}/>)

  return {
    sut,
    authenticationSpy
  }
}

describe('Login', () => {
  test('should start with initial state', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })
    const { getByTestId, getByRole } = sut
    const formStatus = getByTestId('form-status')
    const submitButton = getByRole('button') as HTMLButtonElement
    const emailStatus = getByTestId('email-status')
    const passwordStatus = getByTestId('password-status')

    expect(formStatus.childElementCount).toBe(0)
    expect(submitButton.disabled).toBe(true)
    expect(emailStatus.title).toBe(errorMessage)
    expect(passwordStatus.title).toBe(errorMessage)
  })

  test('should show email error if Validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })

    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    const emailStatus = sut.getByTestId('email-status')

    expect(emailStatus.title).toBe(errorMessage)
  })

  test('should show password error if Validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })

    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    const passwordStatus = sut.getByTestId('password-status')

    expect(passwordStatus.title).toBe(errorMessage)
  })

  test('should show validate email state if Validation succeeds', () => {
    const { sut } = makeSut()

    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })

    const emailStatus = sut.getByTestId('email-status')

    expect(emailStatus.title).toBe('Tudo certo!')
  })

  test('should show validate password state if Validation succeeds', () => {
    const { sut } = makeSut()

    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })

    const passwordStatus = sut.getByTestId('password-status')

    expect(passwordStatus.title).toBe('Tudo certo!')
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

  test('should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()

    const email = faker.internet.email()
    const password = faker.internet.email()

    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: email } })
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: password } })

    const submitButton = sut.getByRole('button')

    fireEvent.click(submitButton)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
})
