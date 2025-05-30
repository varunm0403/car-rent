Feature: Verify confirm booking feature when user is logged in
  As a user
  I want to ensure that all functionalities are working
  So that I can confirm my booking successfully

  Background:
    Given I am on the login page
    When I enter "harry@ok.com" in the username field
    And I enter "Abcd1234" in the password field
    And I click the login button
    When I choose pickup location as "New York"
    And I choose drop-off location as "Los Angeles"
    And I select the pickup date and drop-off date as "25" and "26" and pickup and dropoff time as "10:00 AM" and "11:00 AM"
    And I select the car type as "Luxury"
    And I select the gear box as "Automatic"
    And I select the engine type as "Electric"
    And I click on the find car button
    And I select the car
    And I select the pickup date and drop-off date as "25" and "26" and pickup and dropoff time as "10:00 AM" and "11:00 AM" in the Car Card
    And I click on the book now button

  @smoke
  Scenario: Verify all the data according to the booking confirmation page
    When I am in the booking confirmation page
    Then I should see the booking confirmation page with the following details:
      | Page Title        | Car booking          |
      | Pickup Location   | New York USA         |
      | Drop-off Location | Los Angeles          |
      | Pickup Date       | 25                   |
      | Drop-off Date     | 26                   |
      | Pickup Time       | 10:00 AM             |
      | Drop-off Time     | 11:00 AM             |
      | Car Name          | Audi A6 Quattro 2023 |

  @regression
  Scenario: Verify the Car Confirmation feature
    Given I am in the booking confirmation page
    When I click the Confirm Booking button
    And I accept Confirmation message
    And I click on my bookings button
    Then I should see the The car "Audi A6 Quattro 2023" in my Bookings page

  @regression
  Scenario: change the pickup and dropoff time
    Given I am in the booking confirmation page
    When I click on the change Date and Time button
    When I change the pickup time to "08:00 AM"
    And I change the dropoff time to "12:00 PM"
    And I click on apply button
    Then I should see the booking confirmation page with the following details:
      | Page Title        | Car booking          |
      | Pickup Location   | New York USA         |
      | Drop-off Location | Los Angeles          |
      | Pickup Date       | 25                   |
      | Drop-off Date     | 26                   |
      | Pickup Time       | 08:00 AM             |
      | Drop-off Time     | 12:00 PM             |
      | Car Name          | Audi A6 Quattro 2023 |

  Scenario: change the pickup and dropoff date
    Given I am in the booking confirmation page
    When I click on the change Date and Time button
    When I change the pickup date to "26"
    And I change the dropoff date to "27"
    And I click on apply button
    Then I should see the booking confirmation page with the following details:
      | Page Title        | Car booking          |
      | Pickup Location   | New York USA         |
      | Drop-off Location | Los Angeles          |
      | Pickup Date       | 26                   |
      | Drop-off Date     | 27                   |
      | Pickup Time       | 10:00 AM             |
      | Drop-off Time     | 11:00 AM             |
      | Car Name          | Audi A6 Quattro 2023 |

  Scenario: change the pickup and dropoff location
    Given I am in the booking confirmation page
    When I click on the change Location button
    When I change the pickup location to "Los Angeles"
    And I change the dropoff location to "New York"
    And I click on apply button
    Then I should see the booking confirmation page with the following details:
      | Page Title        | Car booking          |
      | Pickup Location   | Los Angeles          |
      | Drop-off Location | New York USA         |
      | Pickup Date       | 25                   |
      | Drop-off Date     | 26                   |
      | Pickup Time       | 10:00 AM             |
      | Drop-off Time     | 11:00 AM             |
      | Car Name          | Audi A6 Quattro 2023 |

  Scenario: change the pickup and dropoff  date and time together
    Given I am in the booking confirmation page
    When I click on the change Date and Time button
    When I change the pickup time to "08:00 AM"
    And I change the dropoff time to "12:00 PM"
    When I change the pickup date to "26"
    And I change the dropoff date to "27"
    Then I should see the booking confirmation page with the following details:
      | Page Title        | Car booking          |
      | Pickup Location   | New York USA         |
      | Drop-off Location | Los Angeles          |
      | Pickup Date       | 26                   |
      | Drop-off Date     | 27                   |
      | Pickup Time       | 08:00 AM             |
      | Drop-off Time     | 12:00 PM             |
      | Car Name          | Audi A6 Quattro 2023 |

  @smoke
  Scenario: change the pickup and dropoff location and date and time together
    Given I am in the booking confirmation page
    When I click on the change Date and Time button
    When I change the pickup time to "08:00 AM"
    And I change the dropoff time to "12:00 PM"
    When I change the pickup date to "26"
    And I change the dropoff date to "27"
    When I click on the change Location button
    When I change the pickup location to "Los Angeles"
    And I change the dropoff location to "New York"
    Then I should see the booking confirmation page with the following details:
      | Page Title        | Car booking          |
      | Pickup Location   | Los Angeles          |
      | Drop-off Location | New York USA         |
      | Pickup Date       | 26                   |
      | Drop-off Date     | 27                   |
      | Pickup Time       | 08:00 AM             |
      | Drop-off Time     | 12:00 PM             |
      | Car Name          | Audi A6 Quattro 2023 |

  Scenario: verify that car should present after a session
    Given I am in the booking confirmation page
    When I am refresh the page
    Then I should see the booking confirmation page with the following details:
      | Page Title        | Car booking          |
      | Pickup Location   | New York USA         |
      | Drop-off Location | Los Angeles          |
      | Pickup Date       | 25                   |
      | Drop-off Date     | 26                   |
      | Pickup Time       | 10:00 AM             |
      | Drop-off Time     | 11:00 AM             |
      | Car Name          | Audi A6 Quattro 2023 |