import { supabase } from '@/lib/supabase';
import { Tables } from '@/lib/supabase';

export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;

export interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    products: {
      id: string;
      name: string;
      images: string[];
      slug: string;
      sku: string;
    };
  })[];
}

export interface CreateOrderData {
  customer_email: string;
  customer_id?: string;
  currency?: string;
  total_amount: number;
  shipping_address: any;
  billing_address?: any;
  stripe_payment_intent_id?: string;
  notes?: string;
  items: {
    product_id: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}

export interface OrdersResponse {
  orders: OrderWithItems[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class OrdersAPI {
  /**
   * Get all orders with optional filters
   */
  static async getOrders(filters: {
    customerEmail?: string;
    customerId?: string;
    status?: string;
    limit?: number;
    page?: number;
  } = {}): Promise<OrdersResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/orders?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a single order by ID
   */
  static async getOrder(orderId: string): Promise<{ order: OrderWithItems }> {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a new order
   */
  static async createOrder(orderData: CreateOrderData): Promise<{ order: OrderWithItems }> {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update an existing order
   */
  static async updateOrder(orderId: string, updates: Partial<Order>): Promise<{ order: Order }> {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Cancel an order
   */
  static async cancelOrder(orderId: string): Promise<{ message: string }> {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel order: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get orders by customer email
   */
  static async getOrdersByCustomer(customerEmail: string, limit: number = 10): Promise<OrdersResponse> {
    return this.getOrders({ customerEmail, limit });
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'): Promise<{ order: Order }> {
    return this.updateOrder(orderId, { status });
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(orderId: string, paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'): Promise<{ order: Order }> {
    return this.updateOrder(orderId, { payment_status: paymentStatus });
  }

  /**
   * Get order by order number
   */
  static async getOrderByOrderNumber(orderNumber: string): Promise<OrderWithItems | null> {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          price,
          total,
          products (
            id,
            name,
            images,
            slug,
            sku
          )
        )
      `)
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      console.error('Error fetching order by order number:', error);
      return null;
    }

    return order;
  }
}