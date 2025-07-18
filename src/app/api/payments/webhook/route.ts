import { NextRequest, NextResponse } from 'next/server'
import { validateWebhookSignature } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    const event = validateWebhookSignature(body, signature, webhookSecret)

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    const metadata = paymentIntent.metadata
    const items = JSON.parse(metadata.items || '[]')
    const shippingAddress = JSON.parse(metadata.shippingAddress || '{}')
    const billingAddress = JSON.parse(metadata.billingAddress || '{}')

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_email: metadata.customerEmail,
        status: 'processing',
        currency: paymentIntent.currency.toUpperCase(),
        total_amount: paymentIntent.amount / 100,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        payment_status: 'paid',
        stripe_payment_intent_id: paymentIntent.id,
        notes: `Payment processed via Stripe`,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      throw orderError
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      throw itemsError
    }

    // Send order confirmation email (TODO: implement email service)
    await sendOrderConfirmationEmail(order, orderItems)

    console.log(`Order ${orderNumber} created successfully`)
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
    throw error
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    // Log failed payment
    console.log(`Payment failed: ${paymentIntent.id}`)
    
    // You might want to create a record of failed payments
    // or send a notification to the customer
    
    // For now, just log it
    console.log(`Payment failed for: ${paymentIntent.metadata.customerEmail}`)
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handlePaymentCanceled(paymentIntent: any) {
  try {
    // Log canceled payment
    console.log(`Payment canceled: ${paymentIntent.id}`)
    
    // You might want to clean up any pending orders
    // or send a notification
    
    console.log(`Payment canceled for: ${paymentIntent.metadata.customerEmail}`)
  } catch (error) {
    console.error('Error handling payment canceled:', error)
  }
}

async function sendOrderConfirmationEmail(order: any, orderItems: any[]) {
  // TODO: Implement email service (Resend, SendGrid, etc.)
  console.log(`Would send order confirmation email to: ${order.customer_email}`)
  console.log(`Order number: ${order.order_number}`)
  console.log(`Items:`, orderItems)
}