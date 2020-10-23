import { RenderResult, fireEvent } from '@testing-library/react'
import faker from 'faker'

export const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)

  expect(fieldStatus.title).toBe(validationError ?? 'Tudo certo!')
}

export const populateField = (sut: RenderResult, fieldName: string, value = faker.random.word()): void => {
  const input = sut.getByTestId(fieldName)
  fireEvent.input(input, { target: { value } })
}

export const testTextContent = (sut: RenderResult, name: string, text: string): void => {
  const el = sut.getByTestId(name)

  expect(el.textContent).toBe(text)
}
