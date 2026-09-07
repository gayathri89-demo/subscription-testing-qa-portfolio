Feature: Subscription plan selection

  As a prospective subscriber
  I want to compare and select a plan
  So that I can start the appropriate trial

  Background:
    Given the user opens the subscription page

  @smoke
  Scenario: Display subscription plans
    Then the annual plan should be visible
    And the monthly plan should be visible
    And the seven-day trial message should be visible
    And the continue button should be enabled

  @selection
  Scenario: Annual plan is selected by default
    Then the annual plan should be selected
    And the monthly plan should not be selected

  @selection
  Scenario: Select the monthly plan
    Given the annual plan is selected
    When the user selects the monthly plan
    Then the monthly plan should be selected
    And the annual plan should not be selected

  @negative
  Scenario: Prevent duplicate checkout submission
    Given the annual plan is selected
    When the user taps the continue button twice
    Then only one checkout request should be created
    And only one subscription should be created