from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
# Allow CORS from any origin in production, or specific origins
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Model card data
MODEL_CARDS = [
    {
        "id": "snap-eligibility",
        "name": "SNAP (Food Assistance) Eligibility",
        "agency": "Department of Social Services",
        "service": "Food Assistance",
        "description": "Determines if a household qualifies for food assistance based on income, household size, and expenses.",
        "last_audited": "2024-01-15",
        "status": "active",
        "inputs": [
            {"name": "household_income", "type": "number", "label": "Household Income ($)", "min": 0, "max": 100000, "default": 25000},
            {"name": "household_size", "type": "number", "label": "Number of Dependents", "min": 1, "max": 10, "default": 3},
            {"name": "housing_costs", "type": "number", "label": "Monthly Housing Costs ($)", "min": 0, "max": 5000, "default": 1200},
            {"name": "employment_status", "type": "select", "label": "Employment Status", "options": ["employed", "unemployed", "part-time"], "default": "unemployed"}
        ],
        "outputs": [
            {"name": "eligible", "type": "boolean", "label": "Eligible for SNAP"},
            {"name": "benefit_amount", "type": "number", "label": "Estimated Monthly Benefit ($)"},
            {"name": "eligibility_probability", "type": "number", "label": "Eligibility Probability", "format": "percentage"}
        ],
        "transparency_notes": [
            "This model heavily weights income—small reporting errors can change outcomes.",
            "Income thresholds vary by household size (larger households have higher thresholds).",
            "Benefit cliffs occur at specific income levels where eligibility suddenly changes."
        ],
        "fairness_metrics": {
            "demographic_parity": "0.78",
            "equalized_odds": "0.82",
            "calibration": "0.91"
        },
        "data_sources": [
            "Household income tax records",
            "Employment verification system",
            "Housing assistance database"
        ],
        "algorithm_type": "Rule-based with numeric thresholds",
        "decision_sensitivity": "High - small income changes can flip eligibility"
    },
    {
        "id": "housing-voucher-prioritization",
        "name": "Housing Voucher Prioritization",
        "agency": "Housing Authority",
        "service": "Housing Assistance",
        "description": "Predicts priority score for housing assistance (Section 8, emergency vouchers).",
        "last_audited": "2024-02-20",
        "status": "active",
        "inputs": [
            {"name": "household_income", "type": "number", "label": "Household Income ($)", "min": 0, "max": 80000, "default": 20000},
            {"name": "has_children", "type": "boolean", "label": "Has Children", "default": True},
            {"name": "has_elderly", "type": "boolean", "label": "Has Elderly Members", "default": False},
            {"name": "rent_to_income_ratio", "type": "number", "label": "Rent-to-Income Ratio", "min": 0, "max": 1, "step": 0.01, "default": 0.45},
            {"name": "homelessness_risk_score", "type": "number", "label": "Homelessness Risk Score", "min": 0, "max": 100, "default": 65}
        ],
        "outputs": [
            {"name": "priority_score", "type": "number", "label": "Priority Score", "min": 0, "max": 100},
            {"name": "estimated_wait_time", "type": "number", "label": "Estimated Wait Time (months)"},
            {"name": "voucher_type", "type": "string", "label": "Recommended Voucher Type"}
        ],
        "transparency_notes": [
            "Homelessness Risk Score has the highest weight (0.45) in priority calculation.",
            "Fairness audit shows potential under-prioritization of single adults without children.",
            "Priority scores are recalculated monthly based on updated circumstances."
        ],
        "fairness_metrics": {
            "demographic_parity": "0.71",
            "equalized_odds": "0.76",
            "calibration": "0.88"
        },
        "feature_importance": {
            "homelessness_risk_score": 0.45,
            "rent_to_income_ratio": 0.25,
            "has_children": 0.15,
            "has_elderly": 0.10,
            "household_income": 0.05
        },
        "data_sources": [
            "Homelessness prevention database",
            "Rental assistance applications",
            "Census demographic data"
        ],
        "algorithm_type": "Weighted scoring model",
        "decision_sensitivity": "Medium - priority scores are relative and change with applicant pool"
    },
    {
        "id": "unemployment-benefits",
        "name": "Unemployment Benefits Eligibility",
        "agency": "Department of Labor",
        "service": "Unemployment Insurance",
        "description": "Determines eligibility for unemployment insurance and expected benefit amount.",
        "last_audited": "2024-01-30",
        "status": "active",
        "inputs": [
            {"name": "weekly_wage", "type": "number", "label": "Weekly Wage Before Layoff ($)", "min": 0, "max": 5000, "default": 800},
            {"name": "weeks_worked", "type": "number", "label": "Weeks Worked in Base Period", "min": 0, "max": 52, "default": 40},
            {"name": "separation_reason", "type": "select", "label": "Reason for Job Separation", "options": ["laid_off", "fired", "quit", "other"], "default": "laid_off"},
            {"name": "previous_claim_history", "type": "boolean", "label": "Previous Claim in Last 12 Months", "default": False}
        ],
        "outputs": [
            {"name": "eligible", "type": "boolean", "label": "Eligible for Benefits"},
            {"name": "weekly_benefit_amount", "type": "number", "label": "Estimated Weekly Benefit ($)"},
            {"name": "max_benefit_duration", "type": "number", "label": "Maximum Benefit Duration (weeks)"}
        ],
        "transparency_notes": [
            "Categorical decision rules override numeric logic (e.g., 'quit' automatically disqualifies).",
            "Weekly benefit amount is calculated as 50% of average weekly wage, capped at state maximum.",
            "Minimum weeks worked requirement varies by state regulations."
        ],
        "fairness_metrics": {
            "demographic_parity": "0.85",
            "equalized_odds": "0.79",
            "calibration": "0.93"
        },
        "data_sources": [
            "Employer wage reports",
            "State unemployment insurance database",
            "Previous claim records"
        ],
        "algorithm_type": "Rule-based with categorical overrides",
        "decision_sensitivity": "High - categorical rules create hard boundaries"
    }
]

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get all model cards, optionally filtered by query parameters"""
    query = request.args.get('q', '').lower()
    agency = request.args.get('agency', '').lower()
    service = request.args.get('service', '').lower()
    
    filtered_models = MODEL_CARDS
    
    if query:
        filtered_models = [
            m for m in filtered_models
            if query in m['name'].lower() 
            or query in m['description'].lower() 
            or query in m['agency'].lower()
            or query in m['service'].lower()
        ]
    
    if agency:
        filtered_models = [m for m in filtered_models if agency in m['agency'].lower()]
    
    if service:
        filtered_models = [m for m in filtered_models if service in m['service'].lower()]
    
    return jsonify(filtered_models)

@app.route('/api/models/<model_id>', methods=['GET'])
def get_model(model_id):
    """Get a specific model card by ID"""
    model = next((m for m in MODEL_CARDS if m['id'] == model_id), None)
    if model:
        return jsonify(model)
    return jsonify({"error": "Model not found"}), 404

@app.route('/api/models/<model_id>/predict', methods=['POST'])
def predict(model_id):
    """Simulate model prediction based on inputs"""
    model = next((m for m in MODEL_CARDS if m['id'] == model_id), None)
    if not model:
        return jsonify({"error": "Model not found"}), 404
    
    data = request.json
    inputs = data.get('inputs', {})
    
    # Simple simulation logic for each model
    if model_id == "snap-eligibility":
        income = inputs.get('household_income', 25000)
        size = inputs.get('household_size', 3)
        housing = inputs.get('housing_costs', 1200)
        
        # Simplified eligibility logic
        income_threshold = 2000 * size  # $2000 per person per month
        net_income = income / 12 - housing  # Monthly net income
        
        eligible = net_income < income_threshold
        probability = max(0, min(100, 100 - (net_income / income_threshold) * 100))
        benefit = 200 * size if eligible else 0
        
        return jsonify({
            "eligible": eligible,
            "benefit_amount": round(benefit, 2),
            "eligibility_probability": round(probability, 1)
        })
    
    elif model_id == "housing-voucher-prioritization":
        income = inputs.get('household_income', 20000)
        has_children = inputs.get('has_children', True)
        has_elderly = inputs.get('has_elderly', False)
        rent_ratio = inputs.get('rent_to_income_ratio', 0.45)
        risk_score = inputs.get('homelessness_risk_score', 65)
        
        # Weighted priority score
        priority = (
            risk_score * 0.45 +
            (rent_ratio * 100) * 0.25 +
            (100 if has_children else 0) * 0.15 +
            (100 if has_elderly else 0) * 0.10 +
            max(0, (1 - income / 80000) * 100) * 0.05
        )
        
        wait_time = max(1, 24 - (priority / 100) * 20)
        voucher_type = "Emergency" if priority > 80 else "Standard" if priority > 50 else "Waitlist"
        
        return jsonify({
            "priority_score": round(priority, 1),
            "estimated_wait_time": round(wait_time, 1),
            "voucher_type": voucher_type
        })
    
    elif model_id == "unemployment-benefits":
        weekly_wage = inputs.get('weekly_wage', 800)
        weeks_worked = inputs.get('weeks_worked', 40)
        separation_reason = inputs.get('separation_reason', 'laid_off')
        previous_claim = inputs.get('previous_claim_history', False)
        
        # Categorical rule: quit or fired disqualifies
        eligible = (
            separation_reason == 'laid_off' and
            weeks_worked >= 20 and
            not previous_claim
        )
        
        weekly_benefit = (weekly_wage * 0.5) if eligible else 0
        weekly_benefit = min(weekly_benefit, 500)  # Cap at $500
        max_duration = 26 if eligible else 0
        
        return jsonify({
            "eligible": eligible,
            "weekly_benefit_amount": round(weekly_benefit, 2),
            "max_benefit_duration": max_duration
        })
    
    return jsonify({"error": "Prediction not implemented"}), 500

@app.route('/api/agencies', methods=['GET'])
def get_agencies():
    """Get list of all agencies"""
    agencies = list(set(m['agency'] for m in MODEL_CARDS))
    return jsonify(sorted(agencies))

@app.route('/api/services', methods=['GET'])
def get_services():
    """Get list of all services"""
    services = list(set(m['service'] for m in MODEL_CARDS))
    return jsonify(sorted(services))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)

