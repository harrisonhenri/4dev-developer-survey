import React from 'react'
import { render, RenderResult, fireEvent, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { SignUp } from '@/presentation/pages'
import { ValidationStub, AddAccountSpy, Helper, SaveAccessTokenMock } from '@/presentation/test'
import { EmailInUseError } from '@/domain/errors'
import faker from 'faker'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  errorMessage: string
}

const history = createMemoryHistory({ initialEntries: ['/signup'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.errorMessage
  const saveAccessTokenMock = new SaveAccessTokenMock()

  const addAccountSpy = new AddAccountSpy()

  const sut = render(
    <Router history={history}>
      <SignUp
        validation={validationStub}
        addAccount={addAccountSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )

  return {
    sut,
    addAccountSpy,
    saveAccessTokenMock
  }
}

const simulateValidSubmit = async (sut: RenderResult, name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.email()): Promise<void> => {
  Helper.populateField(sut, 'name', name)
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)
  Helper.populateField(sut, 'passwordConfirmation', password)

  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

const testFormStatusChild = (sut: RenderResult, count: number): void => {
  const formStatus = sut.getByTestId('form-status')

  expect(formStatus.childElementCount).toBe(count)
}

describe('SignUp', () => {
  test('should start with initial state', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })
    const { getByRole } = sut
    const submitButton = getByRole('button') as HTMLButtonElement

    expect(submitButton.disabled).toBe(true)
    Helper.testStatusForField(sut, 'name', errorMessage)
    Helper.testStatusForField(sut, 'email', errorMessage)
    Helper.testStatusForField(sut, 'password', errorMessage)
    Helper.testStatusForField(sut, 'passwordConfirmation', errorMessage)
    testFormStatusChild(sut, 0)
  })

  test('Should show name error if Validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })

    Helper.populateField(sut, 'name')

    Helper.testStatusForField(sut, 'name', errorMessage)
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

  test('should show passwordConfirmation error if Validation fails', () => {
    const errorMessage = faker.random.words()
    const { sut } = makeSut({ errorMessage })

    Helper.populateField(sut, 'passwordConfirmation')

    Helper.testStatusForField(sut, 'passwordConfirmation', errorMessage)
  })

  test('should show validate name state if Validation succeeds', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'name')

    Helper.testStatusForField(sut, 'name')
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

  test('should show validate passwordConfirmation state if Validation succeeds', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'passwordConfirmation')

    Helper.testStatusForField(sut, 'passwordConfirmation')
  })

  test('should enable submit button if Validation succeeds', () => {
    const { sut } = makeSut()

    Helper.populateField(sut, 'name')
    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')
    Helper.populateField(sut, 'passwordConfirmation')
    const submitButton = sut.getByRole('button') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()

    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    await simulateValidSubmit(sut, name, email, password)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('should call AddAccount only once', async () => {
    const { sut, addAccountSpy } = makeSut()

    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)

    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('should not call AddAccount if form is invalid', async () => {
    const errorMessage = faker.random.words()

    const { sut, addAccountSpy } = makeSut({ errorMessage })

    await simulateValidSubmit(sut)

    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('should present error if AddAccount fails', async () => {
    const { sut, addAccountSpy } = makeSut()

    const error = new EmailInUseError()

    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)

    await simulateValidSubmit(sut)

    Helper.testTextContent(sut, 'main-error', error.message)
    testFormStatusChild(sut, 1)
  })

  test('should add accessToken to SaveAccessToken on sucess', async () => {
    const { sut, addAccountSpy, saveAccessTokenMock } = makeSut()

    await simulateValidSubmit(sut)

    expect(saveAccessTokenMock.accessToken).toBe(addAccountSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to login page', async () => {
    const { sut } = makeSut()

    const login = sut.getByTestId('login')

    fireEvent.click(login)

    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/login')
  })

  test('should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut()

    const error = new EmailInUseError()

    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error)

    await simulateValidSubmit(sut)

    Helper.testTextContent(sut, 'main-error', error.message)
    testFormStatusChild(sut, 1)
  })
})
