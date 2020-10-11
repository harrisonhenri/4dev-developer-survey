import React from 'react'
import { render } from '@testing-library/react'
import Login from './login'

describe('Login', () => {
  test('should start with initial state', () => {
    const { getByTestId, getByRole } = render(<Login/>)
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
