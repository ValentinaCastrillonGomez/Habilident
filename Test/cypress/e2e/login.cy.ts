describe('login spec', () => {
    it('should login', () => {
        cy.login();

        cy.url().should('include', '/formats');
        cy.window().then((window) => {
            const token = window.localStorage.getItem('token');
            expect(token).to.exist;
        });
    });
});