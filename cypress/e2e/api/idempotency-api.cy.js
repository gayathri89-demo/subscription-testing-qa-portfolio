describe('Subscription Idempotency API', () => {
  const apiUrl = Cypress.expose('apiUrl')

  function uniqueValue(prefix) {
    return `${prefix}-${Date.now()}-${Math.random()}`
  }

  it('returns the same subscription for a repeated request', () => {
    const userId = uniqueValue('idempotent-user')
    const idempotencyKey = uniqueValue('idempotent-key')

    const requestOptions = {
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': userId,
        'idempotency-key': idempotencyKey
      },
      body: {
        planId: 'annual'
      }
    }

    cy.request(requestOptions).then((firstResponse) => {
      expect(firstResponse.status).to.equal(201)
      expect(firstResponse.body.status).to.equal('trial')

      const firstSubscriptionId = firstResponse.body.id

      cy.request(requestOptions).then((secondResponse) => {
        expect(secondResponse.status).to.equal(200)

        // The repeated request must return the same record.
        expect(secondResponse.body.id)
          .to.equal(firstSubscriptionId)

        expect(secondResponse.body.userId)
          .to.equal(userId)

        expect(secondResponse.body.planId)
          .to.equal('annual')
      })
    })
  })

  it('rejects creation without an idempotency key', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': uniqueValue('missing-key-user')
      },
      body: {
        planId: 'monthly'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(400)

      expect(response.body.error)
        .to.equal('Idempotency-Key header is required')
    })
  })

  it('prevents a second active subscription with a new key', () => {
    const userId = uniqueValue('duplicate-user')

    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': userId,
        'idempotency-key': uniqueValue('first-key')
      },
      body: {
        planId: 'annual'
      }
    }).then((firstResponse) => {
      expect(firstResponse.status).to.equal(201)
      expect(firstResponse.body.planId).to.equal('annual')
      expect(firstResponse.body.status).to.equal('trial')

      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/subscriptions`,
        headers: {
          'x-user-id': userId,

          // A different key proves this is not just a retry.
          'idempotency-key': uniqueValue('second-key')
        },
        body: {
          planId: 'monthly'
        },
        failOnStatusCode: false
      }).then((secondResponse) => {
        expect(secondResponse.status).to.equal(409)

        expect(secondResponse.body.error)
          .to.equal(
            'User already has an active subscription'
          )
      })
    })
  })

  it('allows a new subscription after cancellation', () => {
    const userId = uniqueValue('resubscribe-user')

    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': userId,
        'idempotency-key': uniqueValue('original-key')
      },
      body: {
        planId: 'annual'
      }
    }).then((creationResponse) => {
      const subscriptionId = creationResponse.body.id

      cy.request({
        method: 'POST',
        url:
          `${apiUrl}/api/subscriptions/` +
          `${subscriptionId}/cancel`,
        headers: {
          'x-user-id': userId
        }
      }).then((cancellationResponse) => {
        expect(cancellationResponse.status).to.equal(200)
        expect(cancellationResponse.body.status)
          .to.equal('cancelled')
      })

      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/subscriptions`,
        headers: {
          'x-user-id': userId,
          'idempotency-key': uniqueValue('new-key')
        },
        body: {
          planId: 'monthly'
        }
      }).then((newSubscriptionResponse) => {
        expect(newSubscriptionResponse.status).to.equal(201)

        expect(newSubscriptionResponse.body.planId)
          .to.equal('monthly')

        expect(newSubscriptionResponse.body.status)
          .to.equal('trial')

        expect(newSubscriptionResponse.body.id)
          .not.to.equal(subscriptionId)
      })
    })
  })
})