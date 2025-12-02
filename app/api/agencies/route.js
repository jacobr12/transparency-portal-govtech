import { NextResponse } from 'next/server';
import { MODEL_CARDS } from '../models/data.js';

export async function GET() {
  const agencies = [...new Set(MODEL_CARDS.map(m => m.agency))].sort();
  return NextResponse.json(agencies);
}

