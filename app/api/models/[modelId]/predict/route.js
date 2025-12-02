import { NextResponse } from 'next/server';
import { MODEL_CARDS } from '../../data';

export async function POST(request, { params }) {
  const { modelId } = params;
  const model = MODEL_CARDS.find(m => m.id === modelId);
  
  if (!model) {
    return NextResponse.json(
      { error: "Model not found" },
      { status: 404 }
    );
  }
  
  const { inputs } = await request.json();
  
  // Simple simulation logic for each model
  if (modelId === "snap-eligibility") {
    const income = inputs?.household_income || 25000;
    const size = inputs?.household_size || 3;
    const housing = inputs?.housing_costs || 1200;
    
    // Simplified eligibility logic
    const income_threshold = 2000 * size; // $2000 per person per month
    const net_income = income / 12 - housing; // Monthly net income
    
    const eligible = net_income < income_threshold;
    const probability = Math.max(0, Math.min(100, 100 - (net_income / income_threshold) * 100));
    const benefit = eligible ? 200 * size : 0;
    
    return NextResponse.json({
      eligible: eligible,
      benefit_amount: Math.round(benefit * 100) / 100,
      eligibility_probability: Math.round(probability * 10) / 10
    });
  }
  
  if (modelId === "housing-voucher-prioritization") {
    const income = inputs?.household_income || 20000;
    const has_children = inputs?.has_children ?? true;
    const has_elderly = inputs?.has_elderly ?? false;
    const rent_ratio = inputs?.rent_to_income_ratio || 0.45;
    const risk_score = inputs?.homelessness_risk_score || 65;
    
    // Weighted priority score
    const priority = (
      risk_score * 0.45 +
      (rent_ratio * 100) * 0.25 +
      (has_children ? 100 : 0) * 0.15 +
      (has_elderly ? 100 : 0) * 0.10 +
      Math.max(0, (1 - income / 80000) * 100) * 0.05
    );
    
    const wait_time = Math.max(1, 24 - (priority / 100) * 20);
    const voucher_type = priority > 80 ? "Emergency" : priority > 50 ? "Standard" : "Waitlist";
    
    return NextResponse.json({
      priority_score: Math.round(priority * 10) / 10,
      estimated_wait_time: Math.round(wait_time * 10) / 10,
      voucher_type: voucher_type
    });
  }
  
  if (modelId === "unemployment-benefits") {
    const weekly_wage = inputs?.weekly_wage || 800;
    const weeks_worked = inputs?.weeks_worked || 40;
    const separation_reason = inputs?.separation_reason || 'laid_off';
    const previous_claim = inputs?.previous_claim_history ?? false;
    
    // Categorical rule: quit or fired disqualifies
    const eligible = (
      separation_reason === 'laid_off' &&
      weeks_worked >= 20 &&
      !previous_claim
    );
    
    let weekly_benefit = eligible ? (weekly_wage * 0.5) : 0;
    weekly_benefit = Math.min(weekly_benefit, 500); // Cap at $500
    const max_duration = eligible ? 26 : 0;
    
    return NextResponse.json({
      eligible: eligible,
      weekly_benefit_amount: Math.round(weekly_benefit * 100) / 100,
      max_benefit_duration: max_duration
    });
  }
  
  return NextResponse.json(
    { error: "Prediction not implemented" },
    { status: 500 }
  );
}

