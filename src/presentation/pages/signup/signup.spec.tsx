import React from 'react'
import faker from 'faker'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { SignUp } from '@/presentation/pages'
import { ValidationStub, Helper } from '@/presentation/test'
import { AddAccountSpy } from '@/domain/test'
import { EmailInUseError } from '@/domain/errors'
import { AddAccount } from '@/domain/usecases'
import { RecoilRoot } from 'recoil'
import { currentAccountState } from '@/presentation/components'

type SutTypes = {
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AddAccount.Model) => void
}

type SutParams = {
  errorMessage: string
}

const history = createMemoryHistory({ initialEntries: ['/signup'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.errorMessage
  const setCurrentAccountMock = jest.fn()

  const addAccountSpy = new AddAccountSpy()

  render(
    <RecoilRoot initializeState={({ set }) => set(currentAccountState, { setCurrentAccount: setCurrentAccountMock, getCurrentAccount: null })}>
      <Router history={history}>
        <SignUp
          validation={validationStub}
          addAccount={addAccountSpy}
        />
      </Router>
    </RecoilRoot>
  )

  return {
    addAccountSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.email()): Promise<void> => {
  Helper.populateField('name', name)
  Helper.populateField('email', email)
  Helper.populateField('password', password)
  Helper.populateField('passwordConfirmation', password)

  const form = screen.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('SignUp', () => {
  test('should start with initial state', () => {
    const errorMessage = faker.random.words()
    makeSut({ errorMessage })
    expect(screen.getByRole('button') as HTMLButtonElement).toBeDisabled()
    Helper.testStatusForField('name', errorMessage)
    Helper.testStatusForField('email', errorMessage)
    Helper.testStatusForField('password', errorMessage)
    Helper.testStatusForField('passwordConfirmation', errorMessage)
    expect(screen.getByTestId('form-status').children).toHaveLength(0)
  })

  test('Should show name error if Validation fails', () => {
    const errorMessage = faker.random.words()
    makeSut({ errorMessage })

    Helper.populateField('name')

    Helper.testStatusForField('name', errorMessage)
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

  test('should show passwordConfirmation error if Validation fails', () => {
    const errorMessage = faker.random.words()
    makeSut({ errorMessage })

    Helper.populateField('passwordConfirmation')

    Helper.testStatusForField('passwordConfirmation', errorMessage)
  })

  test('should show validate name state if Validation succeeds', () => {
    makeSut()

    Helper.populateField('name')

    Helper.testStatusForField('name')
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

  test('should show validate passwordConfirmation state if Validation succeeds', () => {
    makeSut()

    Helper.populateField('passwordConfirmation')

    Helper.testStatusForField('passwordConfirmation')
  })

  test('should enable submit button if Validation succeeds', () => {
    makeSut()

    Helper.populateField('name')
    Helper.populateField('email')
    Helper.populateField('password')
    Helper.populateField('passwordConfirmation')
    expect(screen.getByRole('button') as HTMLButtonElement).toBeEnabled()
  })

  test('should call AddAccount with correct values', async () => {
    const { addAccountSpy } = makeSut()

    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await simulateValidSubmit(name, email, password)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('should call AddAccount only once', async () => {
    const { addAccountSpy } = makeSut()

    await simulateValidSubmit()
    await simulateValidSubmit()

    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('should not call AddAccount if form is invalid', async () => {
    const errorMessage = faker.random.words()

    const { addAccountSpy } = makeSut({ errorMessage })

    await simulateValidSubmit()

    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('should present error if AddAccount fails', async () => {
    const { addAccountSpy } = makeSut()

    const error = new EmailInUseError()

    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)

    await simulateValidSubmit()

    expect(screen.getByTestId('main-error')).toHaveTextContent(error.message)
    expect(screen.getByTestId('form-status').children).toHaveLength(1)
  })

  test('should add accessToken to UpdateCurrentAccount on sucess', async () => {
    const { addAccountSpy, setCurrentAccountMock } = makeSut()

    await simulateValidSubmit()

    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to login page', async () => {
    makeSut()

    const login = screen.getByTestId('login')

    fireEvent.click(login)

    expect(history.location.pathname).toBe('/login')
    expect(history.length).toBe(1)
  })
})
