Feature: Get car by ID

  Background:
    Given I use the base URL

  Scenario Outline: With correct car ID
    Given I send a GET request to "/cars/<carID>"
    Then I should see the response status code as 200
    And I should see the response matching the "CarsGetByIDResponse" schema
    And Response should have car with ID "<carID>"

    Examples:
      | carID                    |
      | 681c3fab6e1461099262fd1c |
      | 681b4adb423da3b6d15e9363 |


  Scenario: With incorrect car ID
    Given I send a GET request to "/cars/681b4adb423da3b6d19363"
    Then I should see the response status code as 404