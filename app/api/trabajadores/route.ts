import { createServerSupabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { mockTrabajadores } from '../works';

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.from('trabajadores').select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('Supabase error, using mock data:', err);
    return NextResponse.json(mockTrabajadores);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const body = await request.json();
    const { data, error } = await supabase.from('trabajadores').insert([body]).select();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Supabase error, using mock data:', err);
    const body = await request.json();
    const newTrabajador = {
      ...body,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return NextResponse.json([newTrabajador], { status: 201 });
  }
}
