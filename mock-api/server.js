const express = require('express')
const cors = require('cors')
const { randomUUID } = require('crypto')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const plans = [
  {
    id: 'annual',
    name: 'Annual',
    originalMonthlyPrice: 49.99,
    promotionalMonthlyPrice: 33.33,
    billingAmount: 399.99,
    billingFrequency: 'annual',
    dailyEquivalent: 1.10,
    currency: 'AED',
    trialDays: 7
  },
  {
    id: 'monthly',
    name: 'Monthly',
    originalMonthlyPrice: 99.99,
    promotionalMonthlyPrice: 64.99,
    billingAmount: 64.99,
    billingFrequency: 'monthly',
    dailyEquivalent: 2.17,
    currency: 'AED',
    trialDays: 7
  }
]

const subscriptions = []
const idempotencyRecords = new Map()

function getUserId(request) {
  return request.header('x-user-id')
}

function calculateTrialEndDate(trialDays) {
  const trialEndDate = new Date()
  trialEndDate.setUTCDate(trialEndDate.getUTCDate() + trialDays)
  return trialEndDate.toISOString()
}

app.get('/health', (request, response) => {
  response.status(200).json({
    status: 'UP'
  })
})

app.get('/api/subscription-plans', (request, response) => {
  response.status(200).json(plans)
})

app.post('/api/subscriptions', (request, response) => {
  const userId = getUserId(request)
  const idempotencyKey = request.header('idempotency-key')
  const { planId } = request.body

  if (!userId) {
    return response.status(401).json({
      error: 'Authentication required'
    })
  }

  if (!idempotencyKey) {
    return response.status(400).json({
      error: 'Idempotency-Key header is required'
    })
  }

  if (idempotencyRecords.has(idempotencyKey)) {
    return response.status(200).json(
      idempotencyRecords.get(idempotencyKey)
    )
  }

  const selectedPlan = plans.find((plan) => plan.id === planId)

  if (!selectedPlan) {
    return response.status(400).json({
      error: 'Invalid subscription plan'
    })
  }

  const existingSubscription = subscriptions.find(
    (subscription) =>
      subscription.userId === userId &&
      ['trial', 'active'].includes(subscription.status)
  )

  if (existingSubscription) {
    return response.status(409).json({
      error: 'User already has an active subscription'
    })
  }

  const subscription = {
    id: randomUUID(),
    userId,
    planId: selectedPlan.id,
    status: 'trial',
    currency: selectedPlan.currency,
    futureBillingAmount: selectedPlan.billingAmount,
    trialStartedAt: new Date().toISOString(),
    trialEndsAt: calculateTrialEndDate(selectedPlan.trialDays),
    autoRenew: true
  }

  subscriptions.push(subscription)
  idempotencyRecords.set(idempotencyKey, subscription)

  return response.status(201).json(subscription)
})

app.get('/api/subscriptions/:subscriptionId', (request, response) => {
  const userId = getUserId(request)

  if (!userId) {
    return response.status(401).json({
      error: 'Authentication required'
    })
  }

  const subscription = subscriptions.find(
    (item) => item.id === request.params.subscriptionId
  )

  if (!subscription) {
    return response.status(404).json({
      error: 'Subscription not found'
    })
  }

  if (subscription.userId !== userId) {
    return response.status(403).json({
      error: 'Access forbidden'
    })
  }

  return response.status(200).json(subscription)
})

app.post(
  '/api/subscriptions/:subscriptionId/cancel',
  (request, response) => {
    const userId = getUserId(request)

    if (!userId) {
      return response.status(401).json({
        error: 'Authentication required'
      })
    }

    const subscription = subscriptions.find(
      (item) => item.id === request.params.subscriptionId
    )

    if (!subscription) {
      return response.status(404).json({
        error: 'Subscription not found'
      })
    }

    if (subscription.userId !== userId) {
      return response.status(403).json({
        error: 'Access forbidden'
      })
    }

    if (subscription.status === 'cancelled') {
      return response.status(409).json({
        error: 'Subscription is already cancelled'
      })
    }

    subscription.status = 'cancelled'
    subscription.autoRenew = false
    subscription.cancelledAt = new Date().toISOString()

    return response.status(200).json(subscription)
  }
)

app.listen(port, () => {
  console.log(`Mock Subscription API running on port ${port}`)
})