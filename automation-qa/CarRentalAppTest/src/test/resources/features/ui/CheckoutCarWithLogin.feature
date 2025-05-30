Feature: Verify checkout feature when user is logged in
  As a user
  I want to ensure that all functionalities are working
  So that I can checkout successfully

  Background:
    Given I am on the login page
    When I enter "harry@ok.com" in the username field
    And I enter "Abcd1234" in the password field
    And I click the login button

  Scenario: Verify the presence of checkout elements
    Then I should see all checkout page elements

  @regression
  Scenario: Verify the checkout process by clicking the apply button of datepicker
    When I choose pickup location as "New York"
    And I choose drop-off location as "Los Angeles"
    And I select the pickup date and drop-off date as "25" and "26" and pickup and dropoff time as "10:00 AM" and "11:00 AM"
    And I click on apply button
    And I select the car type as "Luxury"
    And I select the gear box as "Automatic"
    And I select the engine type as "Electric"
    And I click on the find car button
    Then I should see the available cars

  @regression
  Scenario: Verify the checkout process by not clicking the apply button of datepicker
    When I choose pickup location as "New York"
    And I choose drop-off location as "Los Angeles"
    And I select the pickup date and drop-off date as "25" and "26" and pickup and dropoff time as "10:00 AM" and "11:00 AM"
    And I select the car type as "Luxury"
    And I select the gear box as "Automatic"
    And I select the engine type as "Electric"
    And I click on the find car button
    Then I should see the available cars

  @smoke
  Scenario: Verify the checkout process by applying filters and selecting a car
    When I choose pickup location as "New York"
    And I choose drop-off location as "Los Angeles"
    And I select the pickup date and drop-off date as "25" and "26" and pickup and dropoff time as "10:00 AM" and "11:00 AM"
    And I select the car type as "Luxury"
    And I select the gear box as "Automatic"
    And I select the engine type as "Electric"
    And I click on the find car button
    Then I should see the available cars
    And I select the car
    And I select the pickup date and drop-off date as "25" and "26" and pickup and dropoff time as "10:00 AM" and "11:00 AM" in the Car Card
    And I click on the book now button
    Then I should see the booking confirmation page