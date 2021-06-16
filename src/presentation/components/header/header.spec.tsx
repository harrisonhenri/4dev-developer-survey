import { Header } from '@/presentation/components'
import { mockAccountModel } from '@/domain/test'

import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { RecoilRoot } from 'recoil'
import { currentAccountState } from '../atoms/atoms'

import { Authentication } from '@/domain/usecases'

import { Router } from 'react-router-dom'
import React from 'react'

type SutTypes = {
  history: MemoryHistory
  setCurrentAccountMock: (account: Authentication.Model) => void
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const setCurrentAccountMock = jest.fn()

  render(
    <RecoilRoot initializeState={({ set }) => set(currentAccountState, { setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => account })}>
      <Router history={history}>
        <Header />
      </Router>
    </RecoilRoot>
  )

  return {
    history,
    setCurrentAccountMock
  }
}

describe('Header Component', () => {
  test('Should call setCurrentAccount with null', () => {
    const { history, setCurrentAccountMock } = makeSut()

    fireEvent.click(screen.getByTestId('logout'))

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  test('Should render username correctly', () => {
    const account = mockAccountModel()
    makeSut(account)

    expect(screen.getByTestId('username')).toHaveTextContent(account.name)
  })
})
