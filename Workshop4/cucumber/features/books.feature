Feature: Books listing and details
  As an application user
  I want to view available books
  So that I can browse and select books

  Scenario: List books
    When I GET "/api/books"
    Then the response status should be 200
    And the response JSON should be an array

  Scenario: Get book details
    Given a book id "1"
    When I GET "/api/books/1"
    Then the response status should be 200
    And the response JSON should contain "title"
