describe('Subscription Idempotency API', () => {
  const apiUrl = Cypress.expose('apiUrl')

  it('returns the same subscription for a repeated request', () => {
    const userId = `idempotent-user-${Date.now()}`
    const idempotencyKey = `idempotent-key-${Date.now()}`

    const options = {
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

    cy.request(options).then((firstResponse) => {
      expect(firstResponse.status).to.equal(201)

      cy.request(options).then((secondResponse) => {
        expect(secondResponse.status).to.equal(200)
        expect(secondResponse.body.id)
          .to.equal(firstResponse.body.id)
      })
    })
  })

  it('rejects creation without an idempotency key', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/subscriptions`,
      headers: {
        'x-user-id': `missing-key-user-${Date.now()}`
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
})