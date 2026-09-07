Feature: Trial and cancellation

  @trial
  Scenario: Start an annual-plan trial
    Given the user selected the annual plan
    When the user starts the free trial
    Then the subscription status should be "trial"
    And the future billing amount should be AED 399.99
    And the trial should end after seven days

  @trial
  Scenario: Start a monthly-plan trial
    Given the user selected the monthly plan
    When the user starts the free trial
    Then the subscription status should be "trial"
    And the future billing amount should be AED 64.99

  @cancellation
  Scenario: Cancel an owned subscription
    Given the user has a trial subscription
    When the user cancels the subscription
    Then its status should be "cancelled"
    And automatic renewal should be disabled

  @security
  Scenario: Prevent another user from cancelling the subscription
    Given User A owns a subscription
    And User B is authenticated
    When User B attempts to cancel User A's subscription
    Then the request should be rejected with status code 403