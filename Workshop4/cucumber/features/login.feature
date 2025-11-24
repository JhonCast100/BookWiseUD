Feature: User login
  As a registered user
  I want to log in
  So that I can access protected resources

  Scenario: Successful login
    Given a user with email "john.doe@example.com" and password "Jd@2025!Secure"
    When the user submits valid credentials to "/api/auth/login"
    Then the response status should be 200
    And the response JSON should contain "token"
