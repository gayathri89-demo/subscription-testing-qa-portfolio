# Subscription API Test Scenarios

## 1. Purpose

This document defines the functional, negative, security, authorization and business-rule test scenarios for the sample Subscription REST API.

The API was developed locally for QA portfolio demonstration. It does not access or represent a private production API.

## 2. Base URL

http://127.0.0.1:3000

## 3. Authentication

Authentication is simulated using the following request header:

x-user-id: user-001

Subscription creation also requires an idempotency key:

idempotency-key: unique-request-key

## 4. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check API availability |
| GET | `/api/subscription-plans` | Retrieve available plans |
| POST | `/api/subscriptions` | Create a trial subscription |
| GET | `/api/subscriptions/:id` | Retrieve a subscription |
| POST | `/api/subscriptions/:id/cancel` | Cancel a subscription |

## 5. Test Scenarios

| ID | Category | Scenario | Expected Result |
|---|---|---|---|
| API-001 | Health | Request the health endpoint | Status `200`; response status is `UP` |
| API-002 | Plans | Retrieve subscription plans | Status `200`; annual and monthly plans returned |
| API-003 | Pricing | Validate annual-plan pricing | Billing amount is AED 399.99 |
| API-004 | Pricing | Validate monthly-plan pricing | Billing amount is AED 64.99 |
| API-005 | Pricing | Validate annual monthly equivalent | Promotional monthly price is AED 33.33 |
| API-006 | Pricing | Validate annual daily equivalent | Daily-equivalent price is AED 1.10 |
| API-007 | Pricing | Validate monthly daily equivalent | Daily-equivalent price is AED 2.17 |
| API-008 | Creation | Create an annual trial | Status `201`; annual trial created |
| API-009 | Creation | Create a monthly trial | Status `201`; monthly trial created |
| API-010 | Trial | Validate trial duration | Trial ends exactly seven days after creation |
| API-011 | Authentication | Create without `x-user-id` | Status `401`; authentication error returned |
| API-012 | Validation | Create without idempotency key | Status `400`; request rejected |
| API-013 | Validation | Create with an invalid plan | Status `400`; invalid-plan error returned |
| API-014 | Idempotency | Repeat a request using the same key | Existing subscription returned; no duplicate created |
| API-015 | Duplicate rule | Create a second active subscription | Status `409`; duplicate subscription prevented |
| API-016 | Retrieval | Retrieve an owned subscription | Status `200`; correct subscription returned |
| API-017 | Authentication | Retrieve without `x-user-id` | Status `401`; protected data not returned |
| API-018 | Authorization | User B retrieves User A's subscription | Status `403`; subscription data not exposed |
| API-019 | Retrieval | Retrieve an unknown subscription | Status `404`; not-found error returned |
| API-020 | Cancellation | Cancel an owned subscription | Status `200`; status becomes `cancelled` |
| API-021 | Cancellation | Verify renewal after cancellation | `autoRenew` is set to `false` |
| API-022 | Authentication | Cancel without `x-user-id` | Status `401`; subscription remains unchanged |
| API-023 | Authorization | User B cancels User A's subscription | Status `403`; subscription remains unchanged |
| API-024 | Cancellation | Cancel an already-cancelled subscription | Status `409`; consistent error returned |
| API-025 | Security | Send a modified price from the client | Client price ignored; server price used |
| API-026 | Routing | Request an unknown endpoint | Status `404` |

## 6. Security Coverage

### Authentication

Protected subscription endpoints require an authenticated user identity.

### Authorization

A user can only retrieve or cancel subscriptions belonging to that user.

### IDOR/BOLA

Changing the subscription ID must not allow one user to access another user’s subscription.

### Sensitive-Data Exposure

A `403` response must contain only a generic error. It must not expose:

- Subscription ID
- User ID
- Plan information
- Billing amount
- Trial dates

### Price Manipulation

Prices submitted from the client must not override server-controlled subscription-plan pricing.

### Duplicate Protection

Repeated requests with the same idempotency key must not create multiple subscriptions.

## 7. Test Data Strategy

Unique user IDs and idempotency keys should be generated for automated tests.

Example:

```javascript
const userId = `user-${Date.now()}`
const idempotencyKey = `key-${Date.now()}`