import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, acceptsMarketing } = await request.json();

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, firstName, lastName' },
        { status: 400 }
      );
    }

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
        },
      },
    });

    if (authError) {
      console.error('Auth registration error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create customer record
    if (authData.user) {
      const { error: customerError } = await supabase
        .from('customers')
        .insert([
          {
            id: authData.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
            accepts_marketing: acceptsMarketing || false,
          },
        ]);

      if (customerError) {
        console.error('Customer creation error:', customerError);
        // Don't fail the registration if customer creation fails
      }
    }

    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: authData.user,
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}