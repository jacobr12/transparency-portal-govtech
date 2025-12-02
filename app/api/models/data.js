// Model card data
export const MODEL_CARDS = [
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
      {"name": "has_children", "type": "boolean", "label": "Has Children", "default": true},
      {"name": "has_elderly", "type": "boolean", "label": "Has Elderly Members", "default": false},
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
      {"name": "previous_claim_history", "type": "boolean", "label": "Previous Claim in Last 12 Months", "default": false}
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
];

