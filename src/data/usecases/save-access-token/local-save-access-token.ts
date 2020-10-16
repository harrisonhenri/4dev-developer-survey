import { SaveAccessToken } from '@/domain/usecases/save-access-token'

interface SetStorage {
  set: (key: string, value: any) => Promise<void>
}

export default class LocalSaveAccessToken implements SaveAccessToken {
  constructor (private readonly SetStorageMock: SetStorage) {}

  async save (accessToken: string): Promise<void> {
    await this.SetStorageMock.set('accessToken', accessToken)
  }
}
