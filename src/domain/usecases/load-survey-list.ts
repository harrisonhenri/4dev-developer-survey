import { SurveyModel } from '@/domain/models/'

export interface LoadSurveyList {
  add: () => Promise<SurveyModel>
}
