import { SurveyModel } from '@/domain/models'

import faker from 'faker'

export const mockRemoteSurveyModel = (): SurveyModel => ({
  id: faker.random.uuid(),
  question: faker.random.words(10),
  answers: [{
    answer: faker.random.words(10),
    image: faker.internet.url()
  }, {
    answer: faker.random.words(5)
  }
  ],
  didAnswer: faker.random.boolean(),
  date: faker.date.recent()
})

export const mockRemoteSurveyListModel = (): SurveyModel[] => ([
  mockRemoteSurveyModel(),
  mockRemoteSurveyModel(),
  mockRemoteSurveyModel()
])
