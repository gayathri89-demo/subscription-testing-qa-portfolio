# Subscription Requirements Traceability Matrix

This matrix maps subscription requirements to manual scenarios, Cypress automation and confirmed defects.

## Functional Requirements

| Requirement | Description | Manual Coverage | Automated Coverage | Status |
|---|---|---|---|---|
| FR-001 | Retrieve subscription plans | Subscription plan display | `plans-api.cy.js` | Covered |
| FR-002 | Start annual trial | Annual trial scenario | `subscription-api.cy.js` | Covered |
| FR-003 | Start monthly trial | Monthly trial scenario | `subscription-api.cy.js` | Covered |
| FR-004 | Validate seven-day trial | Trial-duration scenario | `subscription-api.cy.js` | Covered |
| FR-005 | Retrieve owned subscription | Subscription retrieval scenario | `subscription-api.cy.js` | Covered |
| FR-006 | Cancel owned subscription | Cancellation scenario | `subscription-api.cy.js` | Covered |
| FR-007 | Allow subscription after cancellation | Resubscription scenario | `idempotency-api.cy.js` | Covered |

## Pricing Requirements

| Requirement | Description | Manual Coverage | Automated Coverage | Status |
|---|---|---|---|---|
| PR-001 | Validate annual billing amount | Annual pricing scenario | `plans-api.cy.js` | Covered |
| PR-002 | Validate annual monthly equivalent | Annual calculation scenario | `plans-api.cy.js` | Covered |
| PR-003 | Validate annual daily equivalent | Annual daily calculation | `plans-api.cy.js` | Covered |
| PR-004 | Validate monthly billing amount | Monthly pricing scenario | `plans-api.cy.js` | Covered |
| PR-005 | Validate monthly daily equivalent | Monthly calculation scenario | `plans-api.cy.js` | Covered |
| PR-006 | Validate advertised 33% discount | Discount calculation scenario | Not automated | Defect raised |

## Authentication Requirements

| Requirement | Description | Manual Coverage | Automated Coverage | Status |
|---|---|---|---|---|
| AUTH-001 | Require authentication for creation | Missing authentication scenario | `subscription-api.cy.js` | Covered |
| AUTH-002 | Require authentication for retrieval | Missing authentication scenario | `authorization-api.cy.js` | Covered |
| AUTH-003 | Require authentication for cancellation | Missing authentication scenario | `authorization-api.cy.js` | Covered |
| AUTH-004 | Return 401 when authentication is missing | Negative authentication scenarios | `subscription-api.cy.js`, `authorization-api.cy.js` | Covered |

## Authorization and Security Requirements

| Requirement | Description | Manual Coverage | Automated Coverage | Status |
|---|---|---|---|---|
| SEC-001 | Retrieve only an own subscription | IDOR/B scenario | `authorization-api.cy.js` | Covered |
| SEC-002 | Cancel only an owned subscription | Cross-user cancellation scenario | `authorization-api.cy.js` | Covered |
| SEC-003 | Return 403 for another user's subscription | BOLA scenario | `authorization-api.cy.js` | Covered |
| SEC-004 | Do not expose protected data in 403 response | Sensitive-data scenario | `authorization-api.cy.js` | Covered |
| SEC-005 | Ignore client-supplied price | Price-manipulation scenario | `subscription-api.cy.js` | Covered |
| SEC-006 | Preserve state after unauthorized cancellation | Authorization scenario | `authorization-api.cy.js` | Covered |

## Idempotency and Validation Requirements

| Requirement | Description | Manual Coverage | Automated Coverage | Status |
|---|---|---|---|---|
| VAL-001 | Reject invalid plan | Invalid-plan scenario | `subscription-api.cy.js` | Covered |
| VAL-002 | Require idempotency key | Missing-key scenario | `idempotency-api.cy.js` | Covered |
| VAL-003 | Return same record for repeated request | Idempotency scenario | `idempotency-api.cy.js` | Covered |
| VAL-004 | Prevent multiple active subscriptions | Duplicate-subscription scenario | `idempotency-api.cy.js` | Covered |
| VAL-005 | Return 404 for unknown subscription | Unknown-subscription scenario | `subscription-api.cy.js` | Covered |
| VAL-006 | Handle repeated cancellation | Repeated-cancellation scenario | `subscription-api.cy.js` | Covered |
| VAL-007 | Return 404 for unknown endpoint | Unknown-endpoint scenario | `plans-api.cy.js` | Covered |

## UI and Manual Requirements

| Requirement | Description | Manual Coverage | Automated Coverage | Status |
|---|---|---|---|---|
| UI-001 | Display annual and monthly plans | Plan-display scenario | Not automated | Manual |
| UI-002 | Allow only one selected plan | Plan-selection scenario | Not automated | Manual |
| UI-003 | Submit selected plan | Plan-submission scenario | Not automated | Manual |
| UI-004 | Display future billing information | Trial scenario scenario | Not automated | Manual |
| UI-005 | Respect the mobile safe area | Mobile layout review | Not automated | Manual |
| UI-006 | Open legal documents | Legal-link scenario | Not automated | Manual |
| UI-007 | Provide sufficient colour contrast | Accessibility review | Not automated | Manual |

## Defect Traceability

| Defect | Requirement | Description | Status |
|---|---|---|---|
| BUG-001 | PR-006 | Monthly promotional price represents approximately 35%, not the advertised 33% | Open – requires product clarification |

## Coverage Summary

| Coverage Type | Count |
|---|---:|
| Automated requirements | 29 |
| Manual-only requirements | 7 |
| Confirmed defects | 1 |
| Planned automation | 0 |

## Remaining Work

- Add JSON schema validation.
- Add payment webhook simulation.
- Add automated trial-expiry processing.
- Add refund API coverage.
- Add database validation.
- Add performance testing.