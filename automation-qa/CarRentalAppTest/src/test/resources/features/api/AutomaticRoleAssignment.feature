Feature: Automatic Role Assignment during Registration

  Background:
    Given I use the base URL

  Scenario: Register new user not in SupportAgents list
    Given I load valid "not_in_support_agents_list" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 201
    And I should see the response matching the "UserRegistrationSuccessSchema" schema
    And I should see the response containing the "Client" role

  Scenario: Register new user in SupportAgents list
    Given I load valid "in_support_agents_list" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 201
    And I should see the response matching the "UserRegistrationSuccessSchema" schema
    And I should see the response containing the "SupportAgent" role

  Scenario: Register user with email case sensitivity
    Given I load valid "support_agent_email_case" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 201

  Scenario: Verify response schema contains role field
    Given I load valid "not_in_support_agents_list" registration details
    And I send a POST request to "/auth/sign-up" with my request payload
    Then I should see the response status code as 201
    And I should see the response matching the "UserRegistrationSuccessSchema" schema
