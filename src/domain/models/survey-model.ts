export type SurveyModel = {
  id: string
  question: string
  aswers: [{
    image?: string
    aswer?: string
  }]
  date: Date
  didAnswer: string
}
