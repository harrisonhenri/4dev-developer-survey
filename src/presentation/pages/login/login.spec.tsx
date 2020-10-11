import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import Login from './login'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(<Login/>)

  return {
    sut
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
})
