import * as Helper from '../utils/helpers'

describe('Private Routes', () => {
  it('Should logout if survey-list has no token', () => {
    cy.visit('')
    Helper.testUrl('/login')
  })

  xit('Should logout if survey-result has no token', () => {
    cy.visit('/surveys/any_id')
    Helper.testUrl('/login')
  })
})
