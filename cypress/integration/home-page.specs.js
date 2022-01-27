describe(`Home page`, () => {
  before(() => {
    cy.visit('/')
  })

  it('Should visit the playground', () => {
    cy.url().should('match', new RegExp(Cypress.config('baseUrl')))
  })
  it('Should have a title', () => {
    cy.contains('Meilisearch + React InstantSearch + Gatsby')
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
  it('Should have all articles', () => {
    cy.get('.ais-Hits-list').children().should('have.length', 5)
  })
  it('Should search with typo', () => {
    cy.get('input[type="search"]').type('axlot')
    cy.get('.ais-Hits-list').children().should('have.length', 1)
    cy.get('.hit-title').should('have.text', 'Axolotl')
    cy.get('button[type="reset"]').click()
  })
  it('Should have no matching article', () => {
    cy.get('input[type="search"]').type('Meilisearch')
    cy.get('.ais-Hits-list').children().should('have.length', 0)
    cy.get('button[type="reset"]').click()
  })
})
