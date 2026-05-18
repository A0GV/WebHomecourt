describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/')
    cy.get('#root img.h-full').click();
    cy.get('#root input[placeholder="Email"]').click();
    cy.get('#root input[placeholder="Email"]').click();
    cy.get('#root input[placeholder="Email"]').type('lakerFan@lakerscourt.com');
    cy.get('#root input[placeholder="Password"]').click();
    cy.get('#root input[placeholder="Password"]').type('abc123');
    cy.get('#root button.text-white').click();
    cy.get('#root button:nth-child(4)').click();
    cy.get('#root path[d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"]').click();
    cy.get('#root path[d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"]').click();
    cy.get('#root button.text-amarillo-lakers svg').click();
    cy.get('#root button.rounded-full.text-white svg.h-4').click();
  })
})