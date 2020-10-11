import React from 'react'
import { render, RenderResult, fireEvent } from '@testing-library/react'
import Login from './login'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

class ValidationSpy implements Validation {
  errorMessage: string
  input: object
  validate (input: object): string {
    this.input = input
    return this.errorMessage
  }
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = render(<Login validation={validationSpy}/>)

  return {
    sut,
    validationSpy
  }
}

describe('Login', () => {
  test('should start with initial state', () => {
    const { sut } = makeSut()
    const { getByTestId, getByRole } = sut
    const formStatus = getByTestId('form-status')
    const submitButton = getByRole('button') as HTMLButtonElement
    const emailStatus = getByTestId('email-status')
    const passwordStatus = getByTestId('password-status')

    expect(formStatus.childElementCount).toBe(0)
    expect(submitButton.disabled).toBe(true)
    expect(emailStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus.title).toBe('Campo obrigatório')
  })

  test('should call Validation with correct email', () => {
    const { sut, validationSpy } = makeSut()

    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: 'any_email' } })

    expect(validationSpy.input).toEqual({
      email: 'any_email'
    })
  })

  test('should call Validation with correct password', () => {
    const { sut, validationSpy } = makeSut()

    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: 'any_password' } })

    expect(validationSpy.input).toEqual({
      password: 'any_password'
    })
  })
})
