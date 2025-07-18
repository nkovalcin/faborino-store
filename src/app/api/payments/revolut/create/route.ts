import { NextRequest, NextResponse } from 'next/server'
import { revolutAPI, type OrderDetails } from '@/lib/revolut'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['items', 'customerEmail', 'totalAmount', 'currency']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Generate order ID
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create order details
    const orderDetails: OrderDetails = {
      id: orderId,
      items: body.items,
      customerEmail: body.customerEmail,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      shippingAddress: body.shippingAddress,
      billingAddress: body.billingAddress,
      totalAmount: body.totalAmount,
      currency: body.currency,
      vatAmount: body.vatAmount,
      shippingAmount: body.shippingAmount
    }

    // Create payment with Revolut
    const payment = await revolutAPI.createPayment(orderDetails)

    // Store order details in database (would normally be done here)
    // For now, we'll just return the payment response
    
    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        orderId: orderId,
        checkoutUrl: payment.checkout_url,
        status: payment.state,
        amount: payment.amount / 100, // Convert from cents
        currency: payment.currency
      }
    })

  } catch (error) {
    console.error('Revolut payment creation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get('payment_id')

  if (!paymentId) {
    return NextResponse.json(
      { error: 'Payment ID is required' },
      { status: 400 }
    )
  }

  try {
    const payment = await revolutAPI.getPayment(paymentId)
    
    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.state,
        amount: payment.amount / 100,
        currency: payment.currency,
        createdAt: payment.created_at,
        completedAt: payment.completed_at
      }
    })

  } catch (error) {
    console.error('Revolut payment retrieval error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}