Feature: Backend Connection
    Ensure the backend is online.

Scenario: GET Root Route
    Given I am a client
    When I access the root route
    Then I can see the message Welcome!