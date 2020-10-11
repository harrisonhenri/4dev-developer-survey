import { InvalidFieldError } from '@/validation/errors'
import { EmailValidation } from '@/validation/validators/email/email-validation'
import faker from 'faker'

const makeSut = (): EmailValidation => new EmailValidation(faker.database.column())

describe('EmailValidation', () => {
  test('should return error if field is empty', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return falsy if field is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })
})
