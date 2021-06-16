import { ApiContext } from '@/presentation/contexts'
import React from 'react'
import { RecoilRoot } from 'recoil'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters'
import { makeLogin, makeSurveyList, makeSignUp, makeSurveyResult } from '../factories/pages'
import { PrivateRoute } from '@/presentation/components'

const Router: React.FC = () => {
  return (
    <RecoilRoot>
      <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountAdapter, getCurrentAccount: getCurrentAccountAdapter }}>
        <BrowserRouter>
          <Switch>
            <Route path="/login" exact component={makeLogin}/>
            <Route path="/signup" exact component={makeSignUp}/>
            <PrivateRoute path="/" exact component={makeSurveyList}/>
            <PrivateRoute path="/surveys/:id" exact component={makeSurveyResult}/>
          </Switch>
        </BrowserRouter>
      </ApiContext.Provider>
    </RecoilRoot>
  )
}

export default Router
