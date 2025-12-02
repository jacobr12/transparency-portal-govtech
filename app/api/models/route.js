import { NextResponse } from 'next/server';
import { MODEL_CARDS } from './data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const agency = searchParams.get('agency')?.toLowerCase() || '';
  const service = searchParams.get('service')?.toLowerCase() || '';
  
  let filteredModels = MODEL_CARDS;
  
  if (query) {
    filteredModels = filteredModels.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query) ||
      m.agency.toLowerCase().includes(query) ||
      m.service.toLowerCase().includes(query)
    );
  }
  
  if (agency) {
    filteredModels = filteredModels.filter(m => 
      m.agency.toLowerCase().includes(agency)
    );
  }
  
  if (service) {
    filteredModels = filteredModels.filter(m => 
      m.service.toLowerCase().includes(service)
    );
  }
  
  return NextResponse.json(filteredModels);
}

