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
  it('Should have an article list of 5 elements', () => {
    cy.contains('Article List')
    cy.get('.article-list li').should('have.length', 5)
    cy.get('.article-list li')
      .first()
      .should('have.text', 'Axolotl')
      .next()
      .should('have.text', 'Immortal Jellyfish')
      .next()
      .should('have.text', 'Marmoset')
      .next()
      .should('have.text', 'Okapi')
      .next()
      .should('have.text', 'Shoebill')
  })
  it('Should have a search bar', () => {
    cy.contains('Search in this blog’s articles')
    cy.get('input[type="search"]').should('be.visible')
    cy.get('input[type="search"]')
      .type('Axolotl')
      .should('have.value', 'Axolotl')
  })
})
