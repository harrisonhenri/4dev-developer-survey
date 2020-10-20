import faker from 'faker'
import { AddAccountParams } from 'domain/usecases'

export const mockAddAccountParams = (): AddAccountParams => {
  const password = faker.internet.password()

  return {
    name: faker.random.word(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}
