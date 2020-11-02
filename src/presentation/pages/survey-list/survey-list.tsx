import React, { useEffect, useState } from 'react'
import Styles from './survey-list-styles.scss'
import { Footer, Header, Error } from '@/presentation/components'
import { useErrorHandler } from '@/presentation/hooks'
import { LoadSurveyList } from '@/domain/usecases'
import { SurveyListItem } from '@/presentation/pages/survey-list/components'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, error: error.message }))
  })

  const [state, setState] = useState<{surveys: LoadSurveyList.Model[], error: string, reload: boolean}>({ surveys: [], error: '', reload: false })
  const reload = (): void => setState({ surveys: [], error: '', reload: !state.reload })

  useEffect(() => {
    loadSurveyList.loadAll()
      .then(surveys => setState({ ...state, surveys }))
      .catch(handleError)
  }, [state.reload])

  return (
    <div className={Styles.surveyListContainer}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        {state.error
          ? <Error error={state.error} reload={reload}/>
          : <SurveyListItem surveys={state.surveys}/>
        }
      </div>
      <Footer />
    </div>
  )
}

export default SurveyList
