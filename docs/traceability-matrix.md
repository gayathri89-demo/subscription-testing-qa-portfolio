# Requirements Traceability Matrix

The traceability matrix maps requirements to manual scenarios,
automated Cypress tests and identified defects.

| Requirement | Description | Manual coverage | Automated coverage | Status |
|---|---|---|---|---|
| FR-001 | Retrieve subscription plans | Subscription plan display | `plans-api.cy.js` | Covered |
| FR-002 | Start annual trial | Annual trial scenario | `subscription-api.cy.js` | Covered |
| FR-003 | Start monthly trial | Monthly trial scenario | `subscription-api.cy.js` | Covered |
| FR-004 | Seven-day trial | Trial duration scenario | `subscription-api.cy.js` | Partially covered |
| FR-005 | Cancel subscription | Cancellation scenario | `subscription-api.cy.js` | Covered |
| FR-006 | Prevent active duplicates | Duplicate subscription scenario | `idempotency-api.cy.js` | Covered |
| FR-007 | Require idempotency | Duplicate-request scenario | `idempotency-api.cy.js` | Covered |
| PR-001 | Annual monthly equivalent | Annual calculation scenario | `plans-api.cy.js` | Covered |
| PR-002 | Annual daily equivalent | Annual daily calculation | `plans-api.cy.js` | Covered |
| PR-003 | Monthly daily equivalent | Monthly calculation scenario | `plans-api.cy.js` | Covered |
| PR-004 | Validate advertised discount | Discount scenario | Not automated | Defect raised |
| AUTH-001 | Authenticate subscription creation | Missing authentication scenario | `subscription-api.cy.js` | Covered |
| AUTH-002 | Authenticate retrieval | Missing authentication scenario | `authorization-api.cy.js` | Covered |
| AUTH-003 | Authenticate cancellation | Missing authentication scenario | Planned | Planned |
| AUTH-004 | Return 401 without authentication | Negative authentication scenario | `subscription-api.cy.js` | Covered |
| SEC-001 | Retrieve only owned subscription | IDOR scenario | `authorization-api.cy.js` | Covered |
| SEC-002 | Cancel only owned subscription | Cross-user cancellation scenario | Planned | Planned |
| SEC-003 | Return 403 for another user's record | BOLA scenario | `authorization-api.cy.js` | Covered |
| SEC-004 | Do not expose forbidden data | Sensitive-data scenario | `authorization-api.cy.js` | Covered |
| SEC-005 | Reject client price manipulation | Modified-price scenario | Planned | Planned |
| VAL-001 | Reject invalid plan | Invalid-plan scenario | `subscription-api.cy.js` | Covered |
| VAL-002 | Require idempotency key | Missing-key scenario | `idempotency-api.cy.js` | Covered |
| VAL-003 | Return 404 for unknown subscription | Unknown subscription scenario | Planned | Planned |
| VAL-004 | Return 404 for unknown endpoint | Unknown endpoint scenario | `plans-api.cy.js` | Covered |
| VAL-005 | Handle repeated cancellation | Repeated cancellation scenario | Planned | Planned |
| UI-001 | Display annual and monthly plans | Plan-display scenario | Not automated | Manual |
| UI-002 | Allow only one selected plan | Plan-selection scenario | Not automated | Manual |
| UI-003 | Submit selected plan | Plan-submission scenario | Not automated | Manual |
| UI-004 | Display billing disclosure | Charge disclosure review | Not automated | Defect raised |
| UI-005 | Respect mobile safe area | Mobile layout review | Not automated | Defect raised |
| UI-006 | Open legal documents | Legal-link scenario | Not automated | Manual |
| UI-007 | Provide sufficient contrast | Accessibility review | Not automated | Manual |

## Defect Traceability

| Defect | Related requirement | Description |
|---|---|---|
| BUG-001 | PR-004 | Monthly price represents approximately 35%, not 33% |
| BUG-002 | UI-005 | Header content overlaps the mobile safe area |
| BUG-003 | UI-004 | Trial CTA does not clearly disclose future charge |

## Coverage Summary

| Coverage type | Count |
|---|---:|
| Fully covered | 18 |
| Partially covered | 1 |
| Manual only | 4 |
| Planned automation | 5 |
| Defects raised | 3 |

## Remaining Automation Work

- Validate exact seven-day date difference.
- Reject unauthenticated cancellation.
- Prevent cross-user cancellation.
- Reject client-supplied price manipulation.
- Return 404 for an unknown subscription.
- Validate repeated cancellation response.