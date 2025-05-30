Feature: User Registration

  Background:
    Given I use the base URL

  Scenario: Register user with valid details
    Given I load valid "valid_user_registration" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 201
    And I should see the response matching the "UserRegistrationSuccessSchema" schema

  Scenario: Register without email
    Given I load invalid "missing_email" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register with empty first name
    Given I load invalid "empty_first_name" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register without first name
    Given I load invalid "missing_first_name" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register without last name
    Given I load invalid "missing_last_name" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register with empty email
    Given I load invalid "empty_email" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register with invalid password format
    Given I load invalid "invalid_password" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register with duplicate email
    Given I load invalid "duplicate_email" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 409

  Scenario: Register with too short password
    Given I load invalid "short_password" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register with email missing domain
    Given I load invalid "email_missing_domain" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register with malformed email string
    Given I load invalid "email_just_string" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register with uppercase email
    Given I load valid "uppercase_email" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 201

  Scenario: Register with email missing numbers
    Given I load invalid "email_missing_numbers" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register with password missing uppercase
    Given I load invalid "password_no_uppercase" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register with password missing lowercase
    Given I load invalid "password_no_lowercase" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register with password missing number
    Given I load invalid "password_no_number" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 400

  Scenario: Register with edge case valid password
    Given I load valid "edge_case_password" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 201
