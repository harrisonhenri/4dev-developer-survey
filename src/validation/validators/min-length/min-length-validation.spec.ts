import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from '@/validation/validators/min-length/min-length-validation'
import faker from 'faker'

const makeSut = (minLength: number): MinLengthValidation => new MinLengthValidation(faker.database.column(), minLength)

describe('MinLengthValidation', () => {
  test('should return error if value is invalid', () => {
    const sut = makeSut(5)
    const error = sut.validate('123')
    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return falsy if field is valid', () => {
    const sut = makeSut(5)
    const error = sut.validate('12345')
    expect(error).toBeFalsy()
  })
})
