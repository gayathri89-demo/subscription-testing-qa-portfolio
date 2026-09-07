describe('Subscription Plans API', () => {
  const apiUrl = Cypress.expose('apiUrl')

  it('returns available subscription plans', () => {
    cy.request(`${apiUrl}/api/subscription-plans`)
      .then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(2)
      })
  })

  it('returns annual-plan pricing', () => {
    cy.request(`${apiUrl}/api/subscription-plans`)
      .then((response) => {
        const annualPlan = response.body.find(
          (plan) => plan.id === 'annual'
        )

        expect(annualPlan).to.exist
        expect(annualPlan.name).to.equal('Annual')
        expect(annualPlan.billingAmount).to.equal(399.99)
        expect(annualPlan.promotionalMonthlyPrice).to.equal(33.33)
        expect(annualPlan.dailyEquivalent).to.equal(1.10)
        expect(annualPlan.currency).to.equal('AED')
        expect(annualPlan.trialDays).to.equal(7)
      })
  })

  it('returns monthly-plan pricing', () => {
    cy.request(`${apiUrl}/api/subscription-plans`)
      .then((response) => {
        const monthlyPlan = response.body.find(
          (plan) => plan.id === 'monthly'
        )

        expect(monthlyPlan).to.exist
        expect(monthlyPlan.name).to.equal('Monthly')
        expect(monthlyPlan.billingAmount).to.equal(64.99)
        expect(monthlyPlan.dailyEquivalent).to.equal(2.17)
        expect(monthlyPlan.currency).to.equal('AED')
        expect(monthlyPlan.trialDays).to.equal(7)
      })
  })

  it('returns 404 for an unknown endpoint', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/api/unknown`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(404)
    })
  })
})