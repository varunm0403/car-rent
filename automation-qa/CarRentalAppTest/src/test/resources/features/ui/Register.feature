Feature: ValidateAll kind of registration scenarios
  As a user
  I want to ensure that all functionalities are working
  So that I can register successfully

  Background:
    Given User is on Registration Page

  Scenario: Verify the presence of registration elements
    Then I should see the registration page title
    And I should see the firstname field
    And I should see the surname field
    And I should see the email field
    And I should see the password input field
    And I should see the confirm password field
    And I should see the register button
    And I should see the login link
    And I should see the cancel button

  @regression
  Scenario: Display an error message for invalid email format
    When I enter username, surname, email "$$%2@ok.com" password "Abcd1234" confirm password "Abcd1234"
    Then I should see an error message for the email field indicating the format is invalid

  @regression
  Scenario: Register button is disabled when fields are empty
    Then I should see the register button is disabled

  @regression
  Scenario: Display error when first name, surname, email, password is empty
    When I enter first name , surname , email , password , confirm password as null
    Then I should see an error message for the first name field "First name is required." for surname field "Surname is required." for email field "Email is required." for password field "Password is required."

  @regression
  Scenario: Display error when first name and surname is not in format
    When I enter first name "Harry1234" surname "Potter5678" email "harrypotter"
    Then I should see an error message for the first name field "Special characters are not allowed in first name."
    And I should see an error message for the surname field "Special characters are not allowed in surname."
    And I should see an error message for the email field "Enter a valid email."

  @regression
  Scenario: Display error when password and confirm password is not in format
    When I enter password as "Headwig1234" and confirm password as "Headwig123"
    Then I should see the mismatch error message "Password and Confirm Password do not match."

  @regression
  Scenario Outline: Display error when password is not in format
    When I enter password as "<password>" and confirm password as "<confirmPassword>"
    Then I should see the error message "<errorMessage>"

    Examples:
      | password  | confirmPassword | errorMessage                                         |
      | Harry1    | Harry1          | Password must be at least 8 characters long.         |
      | headwig12 | headwig12       | Password must contain at least one uppercase letter. |
      | Headwig   | Headwig         | Password must contain at least one number.           |

  @regression
  Scenario: Display error when email is already registered
    When I enter first name "Harry" surname "Potter" email "harry@ok.com"
    And I enter password as "Headwig1234" and confirm password as "Headwig1234"
    And I click the register button
    Then I should see an error pop up message "Email already registered."

  @smoke
  Scenario: Successfully register with valid credentials
    When I enter first name "Harry" surname "Potter" and unique email
    And I enter password as "Headwig1234" and confirm password as "Headwig1234"
    And I click the register button
    Then I should navigate to the LoginPage