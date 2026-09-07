describe('Subscription Creation and Cancellation API', () => {
  const apiUrl = Cypress.expose('apiUrl')

  it('creates a seven-day annual trial', () => {
    const userId = `annual-user-${Date.now()}`

    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': userId,
        'idempotency-key': `annual-key-${Date.now()}`
      },
      body: {
        planId: 'annual'
      }
    }).then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.userId).to.equal(userId)
      expect(response.body.planId).to.equal('annual')
      expect(response.body.status).to.equal('trial')
      expect(response.body.futureBillingAmount).to.equal(399.99)
      expect(response.body.autoRenew).to.equal(true)
    })
  })

  it('rejects an unauthenticated request', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'idempotency-key': `unauthenticated-${Date.now()}`
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

  it('rejects an invalid plan', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': `invalid-user-${Date.now()}`,
        'idempotency-key': `invalid-key-${Date.now()}`
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

  it('cancels an owned subscription', () => {
    const userId = `cancel-user-${Date.now()}`

    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': userId,
        'idempotency-key': `cancel-key-${Date.now()}`
      },
      body: {
        planId: 'monthly'
      }
    }).then((creationResponse) => {
      const subscriptionId = creationResponse.body.id

      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/subscriptions/${subscriptionId}/cancel`,
        headers: {
          'x-user-id': userId
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal('cancelled')
        expect(response.body.autoRenew).to.equal(false)
      })
    })
  })
})