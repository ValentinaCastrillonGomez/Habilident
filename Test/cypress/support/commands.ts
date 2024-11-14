/// <reference types="cypress" />

Cypress.Commands.add('login', (_email?, _password?) => {
    cy.visit('/login');

    cy.fixture('login').then(({ email, password }) => {
        cy.get('#email').type(_email ?? email);
        cy.get('#password').type(_password ?? password);
        cy.get('#login').click();
    });
});

export { }
declare global {
    namespace Cypress {
        interface Chainable {
            login(_email?: string, _password?: string): Chainable<void>
        }
    }
}