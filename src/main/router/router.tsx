import React from 'react'
import { RecoilRoot } from 'recoil'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters'
import { makeLogin, makeSurveyList, makeSignUp, makeSurveyResult } from '../factories/pages'
import { currentAccountState, PrivateRoute } from '@/presentation/components'

const Router: React.FC = () => {
  const state = { setCurrentAccount: setCurrentAccountAdapter, getCurrentAccount: getCurrentAccountAdapter }

  return (
    <RecoilRoot initializeState={({ set }) => set(currentAccountState, state)}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact component={makeLogin}/>
          <Route path="/signup" exact component={makeSignUp}/>
          <PrivateRoute path="/" exact component={makeSurveyList}/>
          <PrivateRoute path="/surveys/:id" exact component={makeSurveyResult}/>
        </Switch>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default Router
