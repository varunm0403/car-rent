Feature: Validate all kinds of login scenarios
  As a user, I want to see an error message when I provide invalid credentials
  so that I know my login attempt has failed.

  Background:
    Given I am on the login page

  Scenario: Verify the presence of login elements
    Then I should see the username field
    And I should see the password field
    And I should see the login button
    And I should see the login page title
    And I should see the register link

  @regression
  Scenario Outline: Validate error message for invalid credentials
    When I enter "<username>" in the username field
    And I enter "<password>" in the password field
    And I click the login button
    Then I should see an error message "<errorMessage>"

    Examples:
      | username                  | password | errorMessage                                             |
      | harry-potter@hogwards.com | headwig  | Invalid username. Please check your email and try again. |
      |                           | headwig  | Username is required.                                    |
      | invalidUser               |          | Password is required.                                    |
      | harry-potter@hogwards.com |          | Username and password are required                       |

  @regression
  Scenario Outline: Validate error message for incorrect credentials
    When I enter "<username>" in the username field for incorrect login test
    And I enter "<password>" in the password field for incorrect login test
    And I click the login button
    Then I should see an error message "<errorMessage>" for incorrect login test

    Examples:
      | username                  | password | errorMessage                                             |
      | harry-potter@hogwards.com | headwig  | Invalid username. Please check your email and try again. |
      | ok12                      | headwig  | Invalid username. Please check your email and try again. |

  @regression
  Scenario: Show error when login fields are empty
    When I click the login button without entering any credentials
    Then I should see an error message indicating that the fields are required

  @smoke
  Scenario: Successfully login with valid credentials
    When I enter "harry@ok.com" in the username field
    And I enter "Abcd1234" in the password field
    And I click the login button
    Then I should be redirected to the home page

