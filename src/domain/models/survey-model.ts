export type SurveyModel = {
  id: string
  question: string
  date: Date
  answers: SurveyAnswerModel[]
  didAnswer: boolean
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
}
