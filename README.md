# Transparency Portal for Public Algorithms

A lightweight web application that displays "model cards" or algorithm summaries for public-sector AI models. This portal provides transparency into how government algorithms work, what data they use, and how they make decisions.

## Features

- **Model Card Display**: Structured information about each algorithmic system
- **Search & Filter**: Search by model name, agency, or description; filter by agency or service
- **Interactive Demos**: Sliders and controls to simulate how inputs affect model outputs
- **Transparency Metrics**: Fairness metrics, feature importance, and decision sensitivity information
- **Three Example Scenarios**:
  - SNAP (Food Assistance) Eligibility
  - Housing Voucher Prioritization
  - Unemployment Benefits Eligibility

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── api/                # API routes (backend)
│   │   ├── models/         # Model endpoints
│   │   ├── agencies/       # Agencies endpoint
│   │   └── services/       # Services endpoint
│   ├── page.js             # Main page component
│   ├── layout.js           # Root layout
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── ModelCard.js
│   ├── ModelCardDetail.js
│   ├── InteractiveDemo.js
│   ├── SearchBar.js
│   └── FilterPanel.js
├── package.json            # Dependencies
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md
```

## Setup Instructions

This is a Next.js application with integrated API routes. Everything runs in a single process.

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

The API routes are automatically available at:
- `http://localhost:3000/api/models`
- `http://localhost:3000/api/agencies`
- `http://localhost:3000/api/services`
- etc.

## API Endpoints

- `GET /api/models` - Get all model cards (supports query, agency, and service filters)
- `GET /api/models/<model_id>` - Get a specific model card
- `POST /api/models/<model_id>/predict` - Simulate model prediction with given inputs
- `GET /api/agencies` - Get list of all agencies
- `GET /api/services` - Get list of all services

## Model Card Structure

Each model card includes:
- Basic information (name, agency, service, description)
- Input parameters with types and ranges
- Output predictions
- Transparency notes
- Fairness metrics
- Feature importance (where applicable)
- Data sources
- Decision sensitivity information

## Example Use Cases

### SNAP Eligibility
- Demonstrates how income thresholds affect eligibility
- Shows benefit cliffs and decision sensitivity
- Interactive sliders for income, household size, and housing costs

### Housing Voucher Prioritization
- Displays feature importance (homelessness risk score has highest weight)
- Shows fairness considerations
- Side-by-side scenario comparison capability

### Unemployment Benefits
- Highlights categorical decision rules (e.g., "quit" disqualifies)
- Shows how separation reason affects eligibility
- Demonstrates rule-based vs. statistical boundaries

## Deployment

To deploy this application and share it with others, see **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed instructions or **[DEPLOY_QUICK.md](DEPLOY_QUICK.md)** for a quick start guide.

**Quick summary**: 
1. Push code to GitHub
2. Deploy on Vercel (recommended for Next.js) or Render/Railway
3. Since it's a single Next.js app, no separate backend deployment needed!
4. Share your deployment URL!

## Future Enhancements

- Additional model scenarios
- Export model card data as JSON/PDF
- Comparison view for multiple models
- Historical audit trail
- Integration with real government APIs
- User contributions/feedback system

## License

This is a demonstration project for transparency in public-sector algorithms.

