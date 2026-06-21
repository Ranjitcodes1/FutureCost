import { NextRequest, NextResponse } from 'next/server';
import { compareOptions } from '@/lib/carbon/calculator';
import { SimulationOption } from '@/lib/carbon/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { optionA, optionB }: { optionA: SimulationOption; optionB: SimulationOption } = body;

    if (!optionA || !optionB) {
      return NextResponse.json({ error: 'Both options required' }, { status: 400 });
    }

    const comparison = compareOptions(optionA, optionB);
    return NextResponse.json(comparison);
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 });
  }
}
