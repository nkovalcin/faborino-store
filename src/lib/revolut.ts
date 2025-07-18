// Revolut Business API Integration
// Documentation: https://developer.revolut.com/docs/business-api

interface RevolutConfig {
  apiKey: string
  baseUrl: string
  webhookSecret: string
}

interface PaymentRequest {
  amount: number
  currency: string
  capture_mode: 'AUTOMATIC' | 'MANUAL'
  merchant_order_ext_ref: string
  description: string
  customer_email?: string
  customer_phone?: string
  redirect_urls?: {
    success_url: string
    failure_url: string
    cancel_url: string
  }
  metadata?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface PaymentResponse {
  id: string
  type: 'PAYMENT'
  state: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  created_at: string
  updated_at: string
  completed_at?: string
  amount: number
  currency: string
  merchant_order_ext_ref: string
  description: string
  payment_method_id?: string
  redirect_urls?: {
    success_url: string
    failure_url: string
    cancel_url: string
  }
  checkout_url?: string
  metadata?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface OrderDetails {
  id: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    total: number
  }>
  customerEmail: string
  customerName?: string
  customerPhone?: string
  shippingAddress?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  billingAddress?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  totalAmount: number
  currency: string
  vatAmount?: number
  shippingAmount?: number
}

class RevolutBusinessAPI {
  private config: RevolutConfig

  constructor() {
    this.config = {
      apiKey: process.env.REVOLUT_API_KEY || '',
      baseUrl: process.env.REVOLUT_SANDBOX === 'true' 
        ? 'https://sandbox-merchant.revolut.com/api/1.0' 
        : 'https://merchant.revolut.com/api/1.0',
      webhookSecret: process.env.REVOLUT_WEBHOOK_SECRET || ''
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Revolut API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async createPayment(orderDetails: OrderDetails): Promise<PaymentResponse> {
    const paymentRequest: PaymentRequest = {
      amount: Math.round(orderDetails.totalAmount * 100), // Convert to cents
      currency: orderDetails.currency,
      capture_mode: 'AUTOMATIC',
      merchant_order_ext_ref: orderDetails.id,
      description: `Faborino objednávka #${orderDetails.id}`,
      customer_email: orderDetails.customerEmail,
      customer_phone: orderDetails.customerPhone,
      redirect_urls: {
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sk/checkout/success?order_id=${orderDetails.id}`,
        failure_url: `${process.env.NEXT_PUBLIC_APP_URL}/sk/checkout/failed?order_id=${orderDetails.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/sk/checkout/cancelled?order_id=${orderDetails.id}`
      },
      metadata: {
        customer_name: orderDetails.customerName,
        items_count: orderDetails.items.length,
        vat_amount: orderDetails.vatAmount,
        shipping_amount: orderDetails.shippingAmount
      }
    }

    return await this.request<PaymentResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(paymentRequest)
    })
  }

  async getPayment(paymentId: string): Promise<PaymentResponse> {
    return await this.request<PaymentResponse>(`/orders/${paymentId}`)
  }

  async cancelPayment(paymentId: string): Promise<PaymentResponse> {
    return await this.request<PaymentResponse>(`/orders/${paymentId}/cancel`, {
      method: 'POST'
    })
  }

  async capturePayment(paymentId: string, amount?: number): Promise<PaymentResponse> {
    const body = amount ? { amount: Math.round(amount * 100) } : {}
    
    return await this.request<PaymentResponse>(`/orders/${paymentId}/capture`, {
      method: 'POST',
      body: JSON.stringify(body)
    })
  }

  async refundPayment(paymentId: string, amount?: number): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const body = amount ? { amount: Math.round(amount * 100) } : {}
    
    return await this.request(`/orders/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify(body)
    })
  }

  // Webhook signature verification
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto') // eslint-disable-line @typescript-eslint/no-require-imports
    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(payload, 'utf8')
      .digest('hex')
    
    return `sha256=${expectedSignature}` === signature
  }
}

export const revolutAPI = new RevolutBusinessAPI()
export type { PaymentResponse, OrderDetails, PaymentRequest }