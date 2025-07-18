import { NextRequest, NextResponse } from 'next/server'
import { ibanPaymentSystem } from '@/lib/iban-payment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['orderId', 'amount', 'currency']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const { orderId, amount, currency, description } = body

    // Create payment details
    const paymentDetails = ibanPaymentSystem.createPaymentDetails(
      orderId,
      amount,
      currency,
      description
    )

    // Generate QR code data
    const qrCodeData = await ibanPaymentSystem.generatePaymentQRCode(paymentDetails)

    // Format payment instructions
    const paymentInstructions = ibanPaymentSystem.formatPaymentInstructions(paymentDetails)

    // Store payment details in database (would normally be done here)
    // For now, we'll just return the payment details
    
    return NextResponse.json({
      success: true,
      payment: {
        type: 'iban',
        orderId: orderId,
        reference: paymentDetails.reference,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        qrCodeData: qrCodeData,
        instructions: paymentInstructions,
        bankDetails: ibanPaymentSystem.getBankDetails(),
        status: 'pending'
      }
    })

  } catch (error) {
    console.error('IBAN payment creation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create IBAN payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get('reference')

  if (!reference) {
    return NextResponse.json(
      { error: 'Payment reference is required' },
      { status: 400 }
    )
  }

  try {
    // Check payment status
    const paymentStatus = await ibanPaymentSystem.checkPaymentStatus(reference)
    
    return NextResponse.json({
      success: true,
      payment: {
        reference: reference,
        status: paymentStatus.status,
        amount: paymentStatus.amount,
        receivedAt: paymentStatus.receivedAt
      }
    })

  } catch (error) {
    console.error('IBAN payment status check error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to check payment status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}