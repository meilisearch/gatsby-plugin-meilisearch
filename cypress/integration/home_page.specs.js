describe(`Home page`, () => {
  before(() => {
    cy.visit('/')
  })

  it('Should visit the playground', () => {
    cy.url().should('match', new RegExp(Cypress.config('baseUrl')))
  })
  it('Should have a title', () => {
    cy.contains('MeiliSearch + React InstantSearch + Gatsby')
  })
  it('Should have a search bar', () => {
    cy.contains('Search in this blog’s articles')
    cy.get('input[type="search"]').should('be.visible')
    cy.get('input[type="search"]')
      .type('Axolotl')
      .should('have.value', 'Axolotl')
    cy.get('button[type="reset"]').click()
    cy.get('input[type="search"]').should('be.empty')
  })
  it('Should have articles', () => {
    cy.contains('Shoebill')
  })
})
