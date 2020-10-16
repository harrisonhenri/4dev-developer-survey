import LocalStorageAdapter from './local-storage-adapter'
import faker from 'faker'
import 'jest-localstorage-mock'

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdpater', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should call localStorage with correct values', async () => {
    const sut = makeSut()

    const key = faker.database.column()
    const value = faker.random.word()

    await sut.set(key, value)

    expect(localStorage.setItem).toHaveBeenCalledWith(key, value)
  })
})
