describe('CRUD de usuarios', () => {

  it('Prueba de creación', () => {
    cy.login();
    cy.url().should('include', '/formats');

    cy.visit('/users');
    cy.wait(1000);

    cy.get('#addUser').should('exist').click();

    cy.get('#firstNames').type('nombres');
    cy.get('#lastNames').type('apellidos');
    cy.get('#typeDocument').click({ force: true }).get('mat-option').contains('Cédula de ciudadanía').click();
    cy.get('#numberDocument').type('1234567890', { force: true });
    cy.get('#email').type(`prueba@${Date.now()}.com`, { force: true });
    cy.get('#address').type('direccion');
    cy.get('#phone').type('1234567890');
    cy.get('#birthday').type('13/11/2006', { force: true });
    cy.get('#gender').click({ force: true }).get('mat-option').contains('Hombre').click();
    cy.get('#office').type('uno');
    cy.get('#position').type('prueba');
    cy.get('#role').click({ force: true }).get('mat-option').contains('admin').click();
    cy.get('#password').type('prueba', { force: true });

    cy.get('#saveUser').click();
    cy.wait(1000);
  });

  it('Prueba de visualización', () => {
    cy.login();
    cy.url().should('include', '/formats');

    cy.visit('/users');
    cy.wait(1000);

    cy.get('button.mat-mdc-paginator-navigation-next').click();
    cy.wait(1000);
    cy.get('button.mat-mdc-paginator-navigation-previous').click();
    cy.wait(1000);

    cy.get('#filterUsers').type('admin', { force: true });
    cy.wait(1000);
  });

  it('Prueba de edición', () => {
    cy.login();
    cy.url().should('include', '/formats');

    cy.visit('/users');
    cy.wait(1000);

    cy.get('.options').last().click({ force: true });
    cy.get('#updateUser').click();

    cy.get('#address').type('calle 1 # 2 - 3');
    cy.get('#phone').type('30012345');
    cy.get('#password').type('prueba2', { force: true });

    cy.get('#saveUser').click();
    cy.wait(1000);
  });

  it('Prueba de eliminación', () => {
    cy.login();
    cy.url().should('include', '/formats');

    cy.visit('/users');
    cy.wait(1000);

    cy.get('.options').last().click({ force: true });
    cy.get('#deleteUser').click();

    cy.get('button.swal2-confirm').click();
    cy.wait(1000);
    
    cy.visit('/login');
  });

});