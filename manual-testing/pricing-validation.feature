Feature: Subscription pricing

  @annual @pricing
  Scenario: Validate annual-plan pricing
    Given the annual plan is displayed
    Then the monthly-equivalent price should be AED 33.33
    And the annual charge should be AED 399.99
    And the daily-equivalent price should be AED 1.10

  @monthly @pricing
  Scenario: Validate monthly-plan pricing
    Given the monthly plan is displayed
    Then the promotional monthly price should be AED 64.99
    And the daily-equivalent price should be AED 2.17

  @negative @pricing
  Scenario: Validate monthly plan against advertised discount
    Given the original monthly price is AED 99.99
    And the advertised discount is 33 percent
    When the discount is calculated
    Then the promotional amount should follow the approved pricing rule