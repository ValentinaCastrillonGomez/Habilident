describe('Autenticación de usuarios', () => {

  it('Prueba de acceso', () => {
    cy.fixture('login').then(({ email, password }) => {
      cy.login(email, password);

      cy.url().should('include', '/formats');
      cy.window().then((window) => {
        const token = window.localStorage.getItem('token');
        expect(token).to.exist;
      });
    });
  });

  it('Prueba de redirección', () => {
    cy.login('prueba@prueba.com', 'prueba');

    cy.url().should('include', '/login');

    cy.window().then((window) => {
      const token = window.localStorage.getItem('token');
      expect(token).to.not.exist;
    });
    cy.wait(1000);
  });

  it('Prueba de token', () => {
    cy.fixture('login').then(({ email, password }) => {
      cy.login(email, password);

      cy.url().should('include', '/formats');
      cy.window().then((window) => {
        const token = window.localStorage.getItem('token');
        expect(token).to.exist;

        cy.visit('https://www.jstoolset.com/jwt');
        cy.origin('https://www.jstoolset.com/jwt', { args: { token } }, ({ token }) => {
          cy.get('#page > div > div:nth-child(1) > div.border.borderRadius > textarea').type(token, { delay: 0 });
          cy.get('#page > div > div.floatLeft.transition > div > div.border.borderRadius > div').should('exist');
          cy.get('#page > div > div.floatLeft.transition > div > div.border.borderRadius > div').scrollTo(0, 100);
        });
      });
    });
  });

});