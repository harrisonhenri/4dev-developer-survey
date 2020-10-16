import { SaveAccessToken } from '@/domain/usecases/save-access-token'

interface SetStorage {
  set: (key: string, value: any) => Promise<void>
}

export default class LocalSaveAccessToken implements SaveAccessToken {
  constructor (private readonly SetStorageSpy: SetStorage) {}

  async save (accessToken: string): Promise<void> {
    await this.SetStorageSpy.set('accessToken', accessToken)
  }
}
