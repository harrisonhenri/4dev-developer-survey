import React from 'react'
import { SurveyItem } from '@/presentation/pages/survey-list/components'
import { IconName } from '@/presentation/components'
import { mockSurveyModel } from '@/domain/test'

import { screen, render } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'

type SutTypes = {
  history: MemoryHistory
}

const makeSut = (survey = mockSurveyModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })

  render(
    <SurveyItem survey={survey}/>
  )
  return {
    history
  }
}

describe('SurveyItem Component', () => {
  test('Should render with correct values', () => {
    const survey = {
      ...mockSurveyModel(),
      didAnswer: true,
      date: new Date('2020-01-10T00:00:00')
    }
    makeSut(survey)

    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2020')
  })

  test('Should render with correct values', () => {
    const survey = {
      ...mockSurveyModel(),
      didAnswer: false,
      date: new Date('2019-05-03T00:00:00')
    }
    makeSut(survey)

    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbDown)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('03')
    expect(screen.getByTestId('month')).toHaveTextContent('mai')
    expect(screen.getByTestId('year')).toHaveTextContent('2019')
  })

  // test('Should go to SurveyResult', () => {
  //   const survey = mockSurveyModel()
  //   const { history } = makeSut(survey)

  //   fireEvent.click(screen.getByTestId('link'))

  //   expect(history.location.pathname).toBe(`/surveys/${survey.id}`)
  // })
})
