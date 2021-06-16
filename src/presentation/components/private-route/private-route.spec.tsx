import React from 'react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'

import { currentAccountState, PrivateRoute } from '@/presentation/components'
import { mockAccountModel } from '@/domain/test'
import { RecoilRoot } from 'recoil'

type SutTypes = {
  history: MemoryHistory
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  render(
    <RecoilRoot initializeState={({ set }) => set(currentAccountState, { setCurrentAccount: null, getCurrentAccount: () => account })}>
      <Router history={history}>
        <PrivateRoute />
      </Router>
    </RecoilRoot>)
  return { history }
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const { history } = makeSut(null)

    expect(history.location.pathname).toBe('/login')
  })

  test('Should render current component if token is not empty', () => {
    const { history } = makeSut()

    expect(history.location.pathname).toBe('/')
  })
})
