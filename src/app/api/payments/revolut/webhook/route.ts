import { NextRequest, NextResponse } from 'next/server'
import { revolutAPI } from '@/lib/revolut'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('X-Revolut-Signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      )
    }

    // Verify webhook signature
    const isValid = revolutAPI.verifyWebhookSignature(body, signature)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)

    console.log('Revolut webhook received:', event)

    // Handle different event types
    switch (event.event) {
      case 'ORDER_COMPLETED':
        await handleOrderCompleted(event.data)
        break
      
      case 'ORDER_FAILED':
        await handleOrderFailed(event.data)
        break
      
      case 'ORDER_CANCELLED':
        await handleOrderCancelled(event.data)
        break
      
      case 'ORDER_AUTHORISED':
        await handleOrderAuthorised(event.data)
        break
      
      default:
        console.log('Unhandled Revolut event:', event.event)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Revolut webhook error:', error)
    
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleOrderCompleted(data: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { id, merchant_order_ext_ref, amount, currency } = data

  console.log(`Order completed: ${merchant_order_ext_ref}`, {
    paymentId: id,
    amount: amount / 100,
    currency
  })

  // Here you would:
  // 1. Update order status in database
  // 2. Send confirmation email to customer
  // 3. Trigger order fulfillment process
  // 4. Update inventory
  
  // Example database update (implement based on your DB choice):
  /*
  await updateOrderStatus(merchant_order_ext_ref, {
    status: 'paid',
    paymentId: id,
    paidAt: new Date(),
    amount: amount / 100,
    currency
  })
  */
}

async function handleOrderFailed(data: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { id, merchant_order_ext_ref } = data

  console.log(`Order failed: ${merchant_order_ext_ref}`, {
    paymentId: id,
    state
  })

  // Here you would:
  // 1. Update order status to failed
  // 2. Send failure notification to customer
  // 3. Release reserved inventory
  
  // Example:
  /*
  await updateOrderStatus(merchant_order_ext_ref, {
    status: 'failed',
    failedAt: new Date()
  })
  */
}

async function handleOrderCancelled(data: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { id, merchant_order_ext_ref } = data

  console.log(`Order cancelled: ${merchant_order_ext_ref}`, {
    paymentId: id,
    state
  })

  // Here you would:
  // 1. Update order status to cancelled
  // 2. Release reserved inventory
  // 3. Send cancellation confirmation
  
  // Example:
  /*
  await updateOrderStatus(merchant_order_ext_ref, {
    status: 'cancelled',
    cancelledAt: new Date()
  })
  */
}

async function handleOrderAuthorised(data: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { id, merchant_order_ext_ref, amount, currency } = data

  console.log(`Order authorised: ${merchant_order_ext_ref}`, {
    paymentId: id,
    amount: amount / 100,
    currency
  })

  // Here you would:
  // 1. Update order status to authorised
  // 2. Reserve inventory
  // 3. Prepare for capture (if manual capture is used)
  
  // Example:
  /*
  await updateOrderStatus(merchant_order_ext_ref, {
    status: 'authorised',
    authorisedAt: new Date(),
    amount: amount / 100,
    currency
  })
  */
}