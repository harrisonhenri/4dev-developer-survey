import { FieldValidationSpy } from '@/validation/validators/test/mock-field-validation'
import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite'
import faker from 'faker'

type SutTypes = {
  sut: ValidationComposite
  fieldValidationSpy: FieldValidationSpy[]
}

const makeSut = (field: string): SutTypes => {
  const fieldValidationSpy = [new FieldValidationSpy(field), new FieldValidationSpy(field)]

  const sut = ValidationComposite.build(fieldValidationSpy)

  return {
    sut,
    fieldValidationSpy
  }
}

describe('ValidationComposite', () => {
  test('should return error if value is invalid', () => {
    const field = faker.database.column()

    const { sut, fieldValidationSpy } = makeSut(field)

    const errorMessage = faker.random.words()

    fieldValidationSpy[0].error = new Error(errorMessage)
    fieldValidationSpy[1].error = new Error(faker.random.words())

    const error = sut.validate(field, faker.random.word())

    expect(error).toBe(errorMessage)
  })
  test('should return error if any validation fails', () => {
    const field = faker.database.column()

    const { sut } = makeSut(field)

    const error = sut.validate(field, faker.random.word())

    expect(error).toBeFalsy()
  })
})
