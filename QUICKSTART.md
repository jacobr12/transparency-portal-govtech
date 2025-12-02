# Quick Start Guide

## Prerequisites

- Node.js 14+ and npm installed

## Start the Application

This is a Next.js application with integrated API routes. Everything runs in a single process.

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will start on `http://localhost:3000` and should automatically open in your browser.

## Using the Portal

1. **Browse Model Cards**: The main page shows all available model cards in a grid layout
2. **Search**: Use the search bar to find models by name, agency, or description
3. **Filter**: Use the dropdown filters to narrow by agency or service type
4. **Explore**: Click any model card to see detailed information
5. **Interactive Demo**: In the detail view, use sliders and controls to see how inputs affect model outputs
6. **Transparency Info**: View fairness metrics, feature importance, and transparency notes for each model

## Example Searches

- Search "housing" to find housing-related models
- Search "health" to find health service models
- Filter by "Department of Social Services" to see all their models
- Filter by "Food Assistance" to see all food assistance models

## API Endpoints

The API routes are automatically available at:
- `GET /api/models` - Get all model cards (supports query, agency, and service filters)
- `GET /api/models/[modelId]` - Get a specific model card
- `POST /api/models/[modelId]/predict` - Simulate model prediction with given inputs
- `GET /api/agencies` - Get list of all agencies
- `GET /api/services` - Get list of all services

## Troubleshooting

- **Port already in use**: Change the port by running `PORT=3001 npm run dev`
- **npm install fails**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- **Build errors**: Make sure you're using Node.js 14+ and have all dependencies installed
