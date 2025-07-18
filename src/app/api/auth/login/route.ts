import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password' },
        { status: 400 }
      );
    }

    // Sign in user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Auth login error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 401 }
      );
    }

    // Get customer data
    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    return NextResponse.json({
      message: 'Login successful',
      user: authData.user,
      customer: customer,
      session: authData.session,
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}