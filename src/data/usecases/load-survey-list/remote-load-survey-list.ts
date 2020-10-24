import { HttpGetClient } from '@/data/protocols/http'
import { LoadSurveyList } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'

export default class RemoteLoadSurveyList implements LoadSurveyList {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpGetClient
  ) {}

  async loadAll (): Promise<SurveyModel> {
    await this.httpClient.get({
      url: this.url
    })
    return null
    // const remoteSurveys = httpResponse.body || []
    // switch (httpResponse.statusCode) {
    //   case HttpStatusCode.ok: return remoteSurveys.map(remoteSurvey => ({
    //     ...remoteSurvey,
    //     date: new Date(remoteSurvey.date)
    //   }))
    //   case HttpStatusCode.noContent: return []
    //   default: throw new UnexpectedError()
    // }
  }
}
