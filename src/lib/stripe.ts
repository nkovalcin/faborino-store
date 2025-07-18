import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Client-side Stripe instance
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export { stripePromise }

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Payment Intent creation
export interface CreatePaymentIntentParams {
  amount: number
  currency: string
  customerEmail: string
  customerName?: string
  metadata?: Record<string, string>
}

export async function createPaymentIntent({
  amount,
  currency,
  customerEmail,
  customerName,
  metadata = {}
}: CreatePaymentIntentParams) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: customerEmail,
      metadata: {
        customerEmail,
        customerName: customerName || '',
        ...metadata,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error('Failed to create payment intent')
  }
}

// Create customer
export async function createStripeCustomer(email: string, name?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    })
    return customer
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    throw new Error('Failed to create customer')
  }
}

// Get payment intent
export async function getPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw new Error('Failed to retrieve payment intent')
  }
}

// Update payment intent
export async function updatePaymentIntent(
  paymentIntentId: string,
  params: Partial<CreatePaymentIntentParams>
) {
  try {
    const updateData: any = {}
    
    if (params.amount) {
      updateData.amount = Math.round(params.amount * 100)
    }
    
    if (params.metadata) {
      updateData.metadata = params.metadata
    }

    const paymentIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      updateData
    )
    
    return paymentIntent
  } catch (error) {
    console.error('Error updating payment intent:', error)
    throw new Error('Failed to update payment intent')
  }
}

// Calculate application fee (for future marketplace functionality)
export function calculateApplicationFee(amount: number): number {
  // For now, no application fee
  return 0
}

// Validate webhook signature
export function validateWebhookSignature(
  body: string,
  signature: string,
  endpointSecret: string
) {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    )
    return event
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    throw new Error('Invalid webhook signature')
  }
}

// Payment methods configuration
export const paymentMethods = {
  card: {
    enabled: true,
    name: 'Kreditná/Debetná karta',
    description: 'Visa, Mastercard, American Express',
    icon: '💳',
    fees: 0,
  },
  sepa_debit: {
    enabled: true,
    name: 'SEPA Direct Debit',
    description: 'Platba z bankového účtu',
    icon: '🏦',
    fees: 0,
  },
  sofort: {
    enabled: true,
    name: 'Sofort',
    description: 'Okamžitá platba cez banku',
    icon: '⚡',
    fees: 0,
  },
  giropay: {
    enabled: true,
    name: 'Giropay',
    description: 'Nemecké online bankovníctvo',
    icon: '🇩🇪',
    fees: 0,
  },
  ideal: {
    enabled: true,
    name: 'iDEAL',
    description: 'Holandské online bankovníctvo',
    icon: '🇳🇱',
    fees: 0,
  },
  bancontact: {
    enabled: true,
    name: 'Bancontact',
    description: 'Belgické online bankovníctvo',
    icon: '🇧🇪',
    fees: 0,
  },
}

// Helper function to format currency
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

// Tax calculation (Slovakia VAT)
export function calculateTax(amount: number): number {
  const VAT_RATE = 0.20 // 20% VAT in Slovakia
  return amount * VAT_RATE
}

// Calculate total with tax
export function calculateTotalWithTax(subtotal: number): {
  subtotal: number
  tax: number
  total: number
} {
  const tax = calculateTax(subtotal)
  const total = subtotal + tax
  
  return {
    subtotal,
    tax,
    total,
  }
}

// Shipping calculation
export function calculateShippingCost(
  items: any[],
  country: string = 'SK'
): number {
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Free shipping over 100 EUR
  if (totalValue >= 100) {
    return 0
  }
  
  // Base shipping rates by country
  const shippingRates: Record<string, number> = {
    SK: 4.99,
    CZ: 6.99,
    DE: 8.99,
    AT: 8.99,
    FR: 12.99,
    IT: 12.99,
    ES: 15.99,
    NL: 10.99,
    BE: 10.99,
    PL: 9.99,
  }
  
  return shippingRates[country] || shippingRates.SK
}

// Payment status helpers
export function getPaymentStatusColor(status: string): string {
  switch (status) {
    case 'succeeded':
      return 'text-green-600 bg-green-100'
    case 'processing':
      return 'text-blue-600 bg-blue-100'
    case 'requires_payment_method':
      return 'text-yellow-600 bg-yellow-100'
    case 'requires_confirmation':
      return 'text-yellow-600 bg-yellow-100'
    case 'requires_action':
      return 'text-yellow-600 bg-yellow-100'
    case 'canceled':
      return 'text-red-600 bg-red-100'
    case 'failed':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getPaymentStatusLabel(status: string): string {
  switch (status) {
    case 'succeeded':
      return 'Úspešné'
    case 'processing':
      return 'Spracováva sa'
    case 'requires_payment_method':
      return 'Vyžaduje platobný spôsob'
    case 'requires_confirmation':
      return 'Vyžaduje potvrdenie'
    case 'requires_action':
      return 'Vyžaduje akciu'
    case 'canceled':
      return 'Zrušené'
    case 'failed':
      return 'Neúspešné'
    default:
      return 'Neznámy stav'
  }
}