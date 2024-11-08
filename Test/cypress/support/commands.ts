/// <reference types="cypress" />

Cypress.Commands.add('login', () => {
    cy.visit('/login');
    cy.fixture('login').then(({ email, password }) => {
        cy.get('#email').type(email);
        cy.get('#password').type(password);
        cy.get('#login').click();
    });
});

export { }
declare global {
    namespace Cypress {
        interface Chainable {
            login(): Chainable<void>
        }
    }
}