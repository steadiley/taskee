// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("li", "read a book");
    cy.contains("li", "go to gym");
    cy.contains("li", "cook oyakodon");
  });
});
