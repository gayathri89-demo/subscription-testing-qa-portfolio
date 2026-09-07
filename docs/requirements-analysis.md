# Subscription Requirements Analysis

## Objective

The system allows users to compare monthly and annual subscription
plans, start a seven-day trial and manage their subscriptions.

## Promotional Offer

- The promotion advertises 33% off all plans.
- The promotional price is described as applicable for life.
- The eligibility conditions for the promotion should be documented.

## Annual Plan

- Original monthly-equivalent price: AED 49.99
- Promotional monthly-equivalent price: AED 33.33
- Annual billing amount: AED 399.99
- Daily-equivalent price: AED 1.10
- Trial duration: Seven days

## Monthly Plan

- Original monthly price: AED 99.99
- Promotional monthly price: AED 64.99
- Daily-equivalent price: AED 2.17
- Trial duration: Seven days

## Trial Requirements

- The user should receive seven complete trial days.
- The user should not be charged when starting the trial.
- The first charge date should be displayed.
- A reminder should be sent before the trial ends.
- Cancellation during the trial should stop renewal.
- The selected plan should activate after trial completion.

## Cancellation Requirements

- A user should be able to cancel an owned subscription.
- Cancellation should disable automatic renewal.
- One user should not cancel another user's subscription.
- Repeated cancellation should not cause inconsistent data.

## Refund Requirements

- The page advertises a 30-day refund guarantee.
- Refund eligibility should follow an approved business rule.
- The refund amount should equal the eligible payment.
- Refund terms should be accessible before subscription.

## Security Requirements

- Subscription creation should require authentication.
- A user should only view their own subscription.
- A user should only cancel their own subscription.
- Modified prices sent by a client should not override server prices.
- Repeated requests should not create duplicate subscriptions.

## Pricing Calculations

### Annual Monthly Equivalent

AED 399.99 / 12 = AED 33.3325

Rounded value: AED 33.33

### Annual Daily Equivalent

AED 399.99 / 365 = AED 1.0958

Rounded value: AED 1.10

### Monthly Daily Equivalent

AED 64.99 / 30 = AED 2.1663

Rounded value: AED 2.17

### Monthly Discount

(99.99 - 64.99) / 99.99 × 100 = approximately 35%

The monthly promotional price does not represent an exact 33% discount.
This requires product clarification.