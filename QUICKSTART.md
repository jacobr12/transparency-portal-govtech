# Quick Start Guide

## Prerequisites

- Python 3.7+ installed
- Node.js 14+ and npm installed

## Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend API will start on `http://localhost:5000`

## Step 2: Start the Frontend

Open a **new terminal** (keep the backend running) and run:

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000` and should automatically open in your browser.

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

## Troubleshooting

- **Backend not connecting**: Make sure Flask is running on port 5000
- **CORS errors**: Ensure the backend has flask-cors installed and CORS is enabled
- **Port already in use**: Change the port in `app.py` or use a different port for React
- **npm install fails**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

