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
├── backend/          # Flask API server
│   ├── app.py       # Main Flask application
│   └── requirements.txt
├── frontend/        # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ModelCard.js
│   │   │   ├── ModelCardDetail.js
│   │   │   ├── InteractiveDemo.js
│   │   │   ├── SearchBar.js
│   │   │   └── FilterPanel.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

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
2. Deploy backend on Render/Railway (free)
3. Deploy frontend on Render/Netlify/Vercel (free)
4. Set `REACT_APP_API_URL` environment variable to your backend URL
5. Share your frontend URL!

## Future Enhancements

- Additional model scenarios
- Export model card data as JSON/PDF
- Comparison view for multiple models
- Historical audit trail
- Integration with real government APIs
- User contributions/feedback system

## License

This is a demonstration project for transparency in public-sector algorithms.

