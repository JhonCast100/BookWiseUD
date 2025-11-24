Feature: Borrow and return flow
  As a registered user
  I want to borrow and return books
  So that I can use the library services

  Scenario: Borrow a book
    Given a user with id "1"
    And a book id "1"
    When I POST the payload to "/api/borrow" with:
      | user_id | book_id |
      | 1       | 1       |
    Then the response status should be 200
    And the response JSON should contain "due_date"

  Scenario: Return a book
    Given a user with id "1"
    And a book id "1"
    When I POST the payload to "/api/return" with:
      | user_id | book_id |
      | 1       | 1       |
    Then the response status should be 200
