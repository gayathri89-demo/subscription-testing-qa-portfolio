describe('Subscription Creation and Cancellation API', () => {
  const apiUrl = Cypress.expose('apiUrl')

  function uniqueValue(prefix) {
    return `${prefix}-${Date.now()}-${Math.random()}`
  }

  function createSubscription(userId, planId = 'annual') {
    return cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': userId,
        'idempotency-key': uniqueValue('subscription-key')
      },
      body: {
        planId
      }
    })
  }

  it('creates a seven-day annual trial', () => {
    const userId = uniqueValue('annual-user')

    createSubscription(userId, 'annual').then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.userId).to.equal(userId)
      expect(response.body.planId).to.equal('annual')
      expect(response.body.status).to.equal('trial')
      expect(response.body.currency).to.equal('AED')
      expect(response.body.futureBillingAmount).to.equal(399.99)
      expect(response.body.autoRenew).to.equal(true)
      expect(response.body).to.have.property('trialStartedAt')
      expect(response.body).to.have.property('trialEndsAt')
    })
  })

  it('validates the exact seven-day trial duration', () => {
    const userId = uniqueValue('trial-duration-user')

    createSubscription(userId, 'annual').then((response) => {
      expect(response.status).to.equal(201)

      const trialStartedAt =
        new Date(response.body.trialStartedAt)

      const trialEndsAt =
        new Date(response.body.trialEndsAt)

      const millisecondsPerDay =
        1000 * 60 * 60 * 24

      const trialDurationDays =
        (trialEndsAt - trialStartedAt) /
        millisecondsPerDay

      expect(trialDurationDays).to.be.closeTo(7, 0.001)
    })
  })

  it('creates a monthly trial', () => {
    const userId = uniqueValue('monthly-user')

    createSubscription(userId, 'monthly').then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.userId).to.equal(userId)
      expect(response.body.planId).to.equal('monthly')
      expect(response.body.status).to.equal('trial')
      expect(response.body.currency).to.equal('AED')
      expect(response.body.futureBillingAmount).to.equal(64.99)
      expect(response.body.autoRenew).to.equal(true)
    })
  })

  it('rejects an unauthenticated request', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'idempotency-key': uniqueValue(
          'unauthenticated-key'
        )
      },
      body: {
        planId: 'annual'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(401)

      expect(response.body.error)
        .to.equal('Authentication required')
    })
  })

  it('rejects an invalid subscription plan', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': uniqueValue('invalid-user'),
        'idempotency-key': uniqueValue('invalid-key')
      },
      body: {
        planId: 'invalid'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(400)

      expect(response.body.error)
        .to.equal('Invalid subscription plan')
    })
  })

  it('ignores a price modified by the client', () => {
    const userId = uniqueValue('price-tampering-user')

    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': userId,
        'idempotency-key': uniqueValue('price-key')
      },
      body: {
        planId: 'monthly',
        futureBillingAmount: 0.01,
        promotionalMonthlyPrice: 0.01,
        currency: 'USD'
      }
    }).then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.planId).to.equal('monthly')

      // The server must use its own trusted pricing.
      expect(response.body.futureBillingAmount)
        .to.equal(64.99)

      expect(response.body.currency).to.equal('AED')
    })
  })

  it('retrieves an owned subscription', () => {
    const userId = uniqueValue('retrieval-user')

    createSubscription(userId).then((creationResponse) => {
      const subscriptionId = creationResponse.body.id

      cy.request({
        method: 'GET',
        url:
          `${apiUrl}/api/subscriptions/` +
          `${subscriptionId}`,
        headers: {
          'x-user-id': userId
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.id).to.equal(subscriptionId)
        expect(response.body.userId).to.equal(userId)
        expect(response.body.planId).to.equal('annual')
      })
    })
  })

  it('returns 404 for an unknown subscription', () => {
    cy.request({
      method: 'GET',
      url:
        `${apiUrl}/api/subscriptions/` +
               'unknown-subscription',
      headers: {
        'x-user-id': uniqueValue('unknown-user')
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(404)

      expect(response.body.error)
        .to.equal('Subscription not found')
    })
  })

  it('cancels an owned subscription', () => {
    const userId = uniqueValue('cancellation-user')

    createSubscription(userId, 'monthly')
      .then((creationResponse) => {
        const subscriptionId = creationResponse.body.id

        cy.request({
          method: 'POST',
          url:
            `${apiUrl}/api/subscriptions/` +
            `${subscriptionId}/cancel`,
          headers: {
            'x-user-id': userId
          }
        }).then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body.status).to.equal('cancelled')
          expect(response.body.autoRenew).to.equal(false)
          expect(response.body)
            .to.have.property('cancelledAt')
        })
      })
  })

  it('returns 409 when cancelling twice', () => {
    const userId = uniqueValue('repeat-cancel-user')

    createSubscription(userId, 'monthly')
      .then((creationResponse) => {
        const subscriptionId = creationResponse.body.id

        const cancelRequest = {
          method: 'POST',
          url:
            `${apiUrl}/api/subscriptions/` +
            `${subscriptionId}/cancel`,
          headers: {
            'x-user-id': userId
          }
        }

        cy.request(cancelRequest).then((firstResponse) => {
          expect(firstResponse.status).to.equal(200)
          expect(firstResponse.body.status)
            .to.equal('cancelled')
        })

        cy.request({
          ...cancelRequest,
          failOnStatusCode: false
        }).then((secondResponse) => {
          expect(secondResponse.status).to.equal(409)

          expect(secondResponse.body.error)
            .to.equal(
              'Subscription is already cancelled'
            )
        })
      })
  })
})