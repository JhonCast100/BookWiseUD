Feature: User registration
  As a new user
  I want to register an account
  So that I can log in later

  Scenario: Successful registration
    Given the registration payload:
      | email                | password         | name       |
      | new.user@example.com | NewUser@2025!    | New User   |
    When I POST the payload to "/api/auth/register"
    Then the response status should be 201
    And the response JSON should contain "id"
