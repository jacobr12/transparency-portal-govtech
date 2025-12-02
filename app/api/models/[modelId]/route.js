import { NextResponse } from 'next/server';
import { MODEL_CARDS } from '../data';

export async function GET(request, { params }) {
  const { modelId } = params;
  const model = MODEL_CARDS.find(m => m.id === modelId);
  
  if (!model) {
    return NextResponse.json(
      { error: "Model not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(model);
}

