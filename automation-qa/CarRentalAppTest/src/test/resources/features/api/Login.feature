Feature: User Login

  Background:
    Given I use the base URL

  Scenario Outline: Valid User login
    Given I use credentials "<email>" and "<password>" for login
    And I send a POST request to "/auth/sign-in" with my request payload
    Then I should see the response status code as 200
    And I should see the response matching the "loginResponseSchema" schema

    Examples:
      | email               | password         |
      | apitester@gmail.com | Apitester@123    |
      | demo01@gmail.com    | Demo@12345       |

  Scenario Outline: Invalid login attempts with various cases
    Given I use credentials "<email>" and "<password>" for login
    And I send a POST request to "/auth/sign-in" with my request payload
    Then I should see the response status code as <statusCode>
    Then I should see the error message containing "<message>"

    Examples:
      | email              | password          | statusCode | message                                                             |
      | demo01@gmail.com   | wrongPass         | 401        | Invalid email or password  |
      | john@example.com   |                   | 400        | Password is required       |
      |                    | SecurePass123!    | 400        | Email address is required  |
      | invalid-email      | SecurePass123!    | 400        | Invalid email format       |
