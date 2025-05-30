Feature: Get all cars

  Background:
    Given I use the base URL

#  Scenario: Check request without any query param
#    When I send a GET request to "/cars"
#    Then I should see the response status code as 200
#    And I should see the response matching the "CarsGetAllResponse" schema
#
#  Scenario: Check request with status as query param
#    When  I set the following query parameters
#      | key    | value         |
#      | status | NOT AVAILABLE |
#    And I send a GET request to "/cars"
#    Then I should see the response status code as 200
#    And I should see the response matching the "CarsGetAllResponse" schema
#    And Response should have car with status "NOT AVAILABLE"
#
#  Scenario: Check request with max price as 100
#    When  I set the following query parameters
#      | key      | value |
#      | maxPrice | 100   |
#    And I send a GET request to "/cars"
#    Then I should see the response status code as 200
#    And I should see the response matching the "CarsGetAllResponse" schema
#    And Response should have car with prices less than 100
#
#  Scenario: Check request with min price as 50
#    When  I set the following query parameters
#      | key      | value |
#      | minPrice | 50    |
#    And I send a GET request to "/cars"
#    Then I should see the response status code as 200
#    And I should see the response matching the "CarsGetAllResponse" schema
#    And Response should have car with prices greater than 50

  Scenario: Check request with carRating
    When  I set the following query parameters
      | key      | value |
      | carRating | 3.0   |
    And I send a GET request to "/cars"
    Then I should see the response status code as 200
    And I should see the response matching the "CarsGetAllResponse" schema
    And Response should have car with rating equal to "3.0"