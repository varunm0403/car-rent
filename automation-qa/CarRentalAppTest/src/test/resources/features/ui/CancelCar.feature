Feature: Verify all kinds of cancellation scenarios
  As a user
  I want to ensure that all functionalities are working
  So that I can cancel my booking successfully

  Background:
    Given I am on the login page
    When I enter "harry@ok.com" in the username field
    And I enter "Abcd1234" in the password field
    And I click the login button
    When I choose pickup location as "New York"
    And I choose drop-off location as "Los Angeles"
    And I select the car type as "Luxury"
    And I select the gear box as "Automatic"
    And I select the engine type as "Electric"

  @regression
  Scenario: Verify the Cancel Booking feature before 12 hours of pickup time
    And I select the pickup date and drop-off date as "25" and "26" and pickup and dropoff time as "10:00 AM" and "11:00 AM"
    And I click on the find car button
    And I select the car
    And I select the pickup date and drop-off date as "25" and "26" and pickup and dropoff time as "10:00 AM" and "11:00 AM" in the Car Card
    And I click on the book now button
    Given I am in the booking confirmation page
    When I click the Confirm Booking button
    And I accept Confirmation message
    And I click on my bookings button
    When I click the Cancel Booking button
    And I accept Cancellation message
    Then I should see the The car in cancellation section

  @smoke
  Scenario: Verify the Cancel Booking feature after 12 hours of pickup time
    And I click on the find car button
    And I select the car
    And I click on the book now button
    Given I am in the booking confirmation page
    When I click the Confirm Booking button
    And I accept Confirmation message
    And I click on my bookings button
    Then I should see the cancel button is not disabled