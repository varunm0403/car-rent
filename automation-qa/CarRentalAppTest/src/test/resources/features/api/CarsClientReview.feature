Feature: Car client review

  Background:
    Given I use the base URL

  Scenario Outline: List all Client Reviews
    When I send a GET request to "/cars/<carID>/client-review"
    Then I should see the response status code as 200
    And I should see the response matching the "CarsClientReviewResponse" schema

    Examples:
      | carID                    |
        | 681c3fab6e1461099262fd1c |