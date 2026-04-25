import React from 'react'
import UserData from './User'

describe('<UserData />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<UserData />)
  })
})