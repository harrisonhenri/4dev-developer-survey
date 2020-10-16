import { SaveAccessToken } from '@/domain/usecases/save-access-token'

export class SaveAccessTokenMock implements SaveAccessToken {
  accessToken: string

  async save (acessToken: string): Promise<void> {
    this.accessToken = acessToken
  }
}
