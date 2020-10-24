import { SetStorage } from '@/data/protocols/cache/set-storage'
import { UnexpectedError } from '@/domain/errors'
import { SaveAccessToken } from '@/domain/usecases/save-access-token'

export default class LocalSaveAccessToken implements SaveAccessToken {
  constructor (private readonly SetStorageMock: SetStorage) {}

  async save (accessToken: string): Promise<void> {
    if (!accessToken) {
      throw new UnexpectedError()
    }

    await this.SetStorageMock.set('accessToken', accessToken)
  }
}
