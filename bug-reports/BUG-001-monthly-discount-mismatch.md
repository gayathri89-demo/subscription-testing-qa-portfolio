# BUG-001: Monthly price does not match advertised 33% discount

## Summary

The promotional banner advertises 33% off all plans, but the monthly
price represents approximately a 35% discount.

## Severity

Medium

## Priority

High

## Environment

- Platform: Mobile
- Screen: Subscription plan selection
- Currency: AED

## Preconditions

The promotional subscription offer is available.

## Steps to Reproduce

1. Open the subscription plan screen.
2. Locate the offer advertising 33% off all plans.
3. Locate the monthly subscription.
4. Note the original price of AED 99.99.
5. Note the promotional price of AED 64.99.
6. Calculate the discount percentage.

## Actual Result

The calculated discount is:

```text
(99.99 - 64.99) / 99.99 × 100 = approximately 35%