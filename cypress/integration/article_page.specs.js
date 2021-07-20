describe(`Article page`, () => {
  before(() => {
    cy.visit('/axolotl')
  })
  it('Should have the article content', () => {
    cy.get('h1').should('have.text', 'Axolotl')
    cy.get('img').should(
      'have.attr',
      'src',
      'https://upload.wikimedia.org/wikipedia/commons/d/df/Axolotl.jpg'
    )
    cy.get('h2').should('have.length', 5)
    cy.get('h3').should('have.length', 3)
  })
})
