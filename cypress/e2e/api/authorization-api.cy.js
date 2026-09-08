describe('Subscription Authorization API', () => {
  const apiUrl = Cypress.expose('apiUrl')

  function createSubscription(userId, planId = 'annual') {
    return cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': userId,
        'idempotency-key':
          `authorization-key-${Date.now()}-${Math.random()}`
      },
      body: {
        planId
      }
    })
  }

  it('rejects subscription retrieval without authentication', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/api/subscriptions/unknown-subscription`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(401)
      expect(response.body.error)
        .to.equal('Authentication required')
    })
  })

  it('allows a user to retrieve an owned subscription', () => {
    const ownerId = `owner-${Date.now()}`

    createSubscription(ownerId).then((creationResponse) => {
      const subscriptionId = creationResponse.body.id

      cy.request({
        method: 'GET',
        url: `${apiUrl}/api/subscriptions/${subscriptionId}`,
        headers: {
          'x-user-id': ownerId
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.id).to.equal(subscriptionId)
        expect(response.body.userId).to.equal(ownerId)
      })
    })
  })

  it('prevents cross-user subscription retrieval', () => {
    const ownerId = `owner-${Date.now()}`
    const otherUserId = `other-user-${Date.now()}`

    createSubscription(ownerId).then((creationResponse) => {
      const subscription = creationResponse.body

      cy.request({
        method: 'GET',
        url: `${apiUrl}/api/subscriptions/${subscription.id}`,
        headers: {
          'x-user-id': otherUserId
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(403)
        expect(response.body)
          .to.deep.equal({ error: 'Access forbidden' })
      })
    })
  })

  it('does not expose protected data in a forbidden response', () => {
    const ownerId = `protected-owner-${Date.now()}`
    const otherUserId = `unauthorized-user-${Date.now()}`

    createSubscription(ownerId).then((creationResponse) => {
      const subscription = creationResponse.body

      cy.request({
        method: 'GET',
        url: `${apiUrl}/api/subscriptions/${subscription.id}`,
        headers: {
          'x-user-id': otherUserId
        },
        failOnStatusCode: false
      }).then((response) => {
        const responseText = JSON.stringify(response.body)

        expect(response.status).to.equal(403)
        expect(response.body)
          .to.deep.equal({ error: 'Access forbidden' })

        expect(responseText).not.to.include(subscription.id)
        expect(responseText).not.to.include(ownerId)
        expect(responseText).not.to.include(subscription.planId)
        expect(responseText).not.to.include(
          String(subscription.futureBillingAmount)
        )
      })
    })
  })

  it('rejects cancellation without authentication', () => {
    const ownerId = `cancel-owner-${Date.now()}`

    createSubscription(ownerId).then((creationResponse) => {
      const subscriptionId = creationResponse.body.id

      cy.request({
        method: 'POST',
        url:
          `${apiUrl}/api/subscriptions/` +
          `${subscriptionId}/cancel`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(401)
        expect(response.body.error)
          .to.equal('Authentication required')
      })
    })
  })

  it('prevents another user from cancelling a subscription', () => {
    const ownerId = `cancellation-owner-${Date.now()}`
    const otherUserId = `cancellation-attacker-${Date.now()}`

    createSubscription(ownerId).then((creationResponse) => {
      const subscriptionId = creationResponse.body.id

      cy.request({
        method: 'POST',
        url:
          `${apiUrl}/api/subscriptions/` +
          `${subscriptionId}/cancel`,
        headers: {
          'x-user-id': otherUserId
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(403)
        expect(response.body)
          .to.deep.equal({ error: 'Access forbidden' })
      })
    })
  })

  it('preserves subscription state after unauthorized cancellation', () => {
    const ownerId = `state-owner-${Date.now()}`
    const otherUserId = `state-attacker-${Date.now()}`

    createSubscription(ownerId).then((creationResponse) => {
      const subscriptionId = creationResponse.body.id

      cy.request({
        method: 'POST',
        url:
          `${apiUrl}/api/subscriptions/` +
          `${subscriptionId}/cancel`,
        headers: {
          'x-user-id': otherUserId
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(403)
      })

      cy.request({
        method: 'GET',
        url: `${apiUrl}/api/subscriptions/${subscriptionId}`,
        headers: {
          'x-user-id': ownerId
        }
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal('trial')
        expect(response.body.autoRenew).to.equal(true)
      })
    })
  })
})