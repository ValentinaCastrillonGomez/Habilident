describe('CRUD de roles', () => {

  it('Prueba de creación', () => {
    cy.login();
    cy.url().should('include', '/formats');

    cy.visit('/roles');
    cy.wait(1000);

    cy.get('#addRoles').should('exist');
    cy.get('#addRoles').click();
    cy.get('#name').type(`rol ${Date.now()}`);

    cy.get('input[id^="mat-mdc-checkbox-"]').each(($checkbox) => {
      cy.wrap($checkbox).click();
    });
    cy.get('#saveRole').click();
    cy.wait(1000);
  });

  it('Prueba de visualización', () => {
    cy.login();
    cy.url().should('include', '/formats');

    cy.visit('/roles');
    cy.wait(1000);

    cy.get('button.mat-mdc-paginator-navigation-next').click();
    cy.wait(1000);
    cy.get('button.mat-mdc-paginator-navigation-previous').click();
    cy.wait(1000);

    cy.get('#filterRoles').type('admin');
    cy.wait(1000);
  });

  it('Prueba de edición', () => {
    cy.login();
    cy.url().should('include', '/formats');

    cy.visit('/roles');
    cy.wait(1000);

    cy.get('.options').last().click({ force: true });
    cy.get('#updateRole').click();

    cy.get('input[id^="mat-mdc-checkbox-"]').each(($checkbox) => {
      cy.wrap($checkbox).click();
    });

    cy.get('#saveRole').click();
    cy.wait(1000);
  });

  it('Prueba de eliminación', () => {
    cy.login();
    cy.url().should('include', '/formats');

    cy.visit('/roles');
    cy.wait(1000);

    cy.get('.options').last().click({ force: true });
    cy.get('#deleteRole').click();

    cy.get('button.swal2-confirm').click();
    cy.wait(1000);
  });

});