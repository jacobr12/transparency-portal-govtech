import { NextResponse } from 'next/server';
import { MODEL_CARDS } from '../models/data.js';

export async function GET() {
  const services = [...new Set(MODEL_CARDS.map(m => m.service))].sort();
  return NextResponse.json(services);
}

