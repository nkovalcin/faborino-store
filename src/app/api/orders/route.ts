import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get('customerEmail');
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    let query = supabaseServer
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
            slug
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (customerEmail) {
      query = query.eq('customer_email', customerEmail);
    }

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Basic validation
    if (!orderData.customer_email || !orderData.items || !orderData.total_amount) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_email, items, total_amount' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `FBR-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Start transaction
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_email: orderData.customer_email,
        customer_id: orderData.customer_id,
        status: 'pending',
        currency: orderData.currency || 'EUR',
        total_amount: orderData.total_amount,
        shipping_address: orderData.shipping_address,
        billing_address: orderData.billing_address || orderData.shipping_address,
        payment_status: 'pending',
        revolut_payment_id: orderData.revolut_payment_id,
        notes: orderData.notes
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    }));

    const { error: itemsError } = await supabaseServer
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback order creation
      await supabaseServer
        .from('orders')
        .delete()
        .eq('id', order.id);

      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Update product inventory
    for (const item of orderData.items) {
      const { error: inventoryError } = await supabaseServer
        .from('products')
        .update({
          inventory_quantity: supabaseServer.raw('inventory_quantity - ?', [item.quantity])
        })
        .eq('id', item.product_id);

      if (inventoryError) {
        console.error('Error updating inventory:', inventoryError);
        // Continue with other items even if one fails
      }
    }

    // Fetch complete order with items
    const { data: completeOrder } = await supabaseServer
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
            slug
          )
        )
      `)
      .eq('id', order.id)
      .single();

    return NextResponse.json({ order: completeOrder }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}