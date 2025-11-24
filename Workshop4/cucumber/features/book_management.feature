Feature: Book management (admin)
  As an admin
  I want to add, update and delete books
  So that the catalog can be maintained

  Scenario: Add a new book
    Given the book payload:
      | title           | author        | isbn        |
      | New Book Title  | Some Author   | 97812345678 |
    When I POST the payload to "/api/books"
    Then the response status should be 201
    And the response JSON should contain "id"

  Scenario: Update a book
    Given a book id "1"
    And the book payload:
      | title          |
      | Updated Title  |
    When I PUT the payload to "/api/books/1"
    Then the response status should be 200

  Scenario: Delete a book
    Given a book id "1"
    When I DELETE "/api/books/1"
    Then the response status should be 204
