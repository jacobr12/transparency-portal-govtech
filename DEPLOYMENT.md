# Deployment Guide

This guide will help you deploy the Transparency Portal so you can share a real URL with friends.

## Option 1: Render (Recommended - Easiest & Free)

Render offers free hosting for both backend and frontend.

### Deploy Backend

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or push this code to GitHub first)
   - Select the repository

3. **Configure the backend**:
   - **Name**: `transparency-portal-backend` (or any name)
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free

4. **Add Environment Variable** (optional):
   - Key: `FLASK_ENV`
   - Value: `production`

5. Click "Create Web Service"
   - Render will give you a URL like: `https://your-backend-name.onrender.com`

### Deploy Frontend

1. **Build the frontend locally first** (to set the API URL):
   ```bash
   cd frontend
   # Create .env file with your backend URL
   echo "REACT_APP_API_URL=https://your-backend-name.onrender.com/api" > .env
   npm install
   npm run build
   ```

2. **Create a new Static Site on Render**:
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && REACT_APP_API_URL=https://your-backend-name.onrender.com/api npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

3. **Add Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-name.onrender.com/api`

4. Click "Create Static Site"
   - You'll get a URL like: `https://your-frontend-name.onrender.com`

**Note**: On Render's free tier, services spin down after 15 minutes of inactivity. First load may take 30-60 seconds.

---

## Option 2: Railway (Also Easy & Free)

### Deploy Backend

1. **Create Railway account** at [railway.app](https://railway.app)

2. **Create New Project** → "Deploy from GitHub repo"

3. **Add Service** → Select your repo

4. **Configure**:
   - **Root Directory**: `backend`
   - Railway auto-detects Python
   - It will use `requirements.txt` automatically

5. **Add Environment Variable**:
   - `PORT` (Railway sets this automatically, but you can verify)

6. Railway gives you a URL like: `https://your-backend-name.up.railway.app`

### Deploy Frontend

1. **Add another service** in the same Railway project

2. **Configure**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && REACT_APP_API_URL=https://your-backend-name.up.railway.app/api npm run build`
   - **Start Command**: `npx serve -s build`
   - **Add to package.json** (temporary):
     ```json
     "scripts": {
       "serve": "serve -s build"
     }
     ```

3. **Add Environment Variable**:
   - `REACT_APP_API_URL` = `https://your-backend-name.up.railway.app/api`

---

## Option 3: Netlify (Frontend) + Render/Railway (Backend)

### Backend
Deploy backend using Option 1 or 2 above.

### Frontend on Netlify

1. **Create Netlify account** at [netlify.com](https://netlify.com)

2. **Build locally first**:
   ```bash
   cd frontend
   echo "REACT_APP_API_URL=https://your-backend-url.com/api" > .env.production
   npm install
   npm run build
   ```

3. **Deploy**:
   - Drag and drop the `frontend/build` folder to Netlify
   - Or connect GitHub and set:
     - **Build command**: `npm install && REACT_APP_API_URL=https://your-backend-url.com/api npm run build`
     - **Publish directory**: `build`

4. **Add Environment Variable** in Netlify dashboard:
   - `REACT_APP_API_URL` = `https://your-backend-url.com/api`

---

## Option 4: Vercel (Frontend) + Any Backend

### Backend
Deploy backend using Option 1 or 2 above.

### Frontend on Vercel

1. **Create Vercel account** at [vercel.com](https://vercel.com)

2. **Import your GitHub repository**

3. **Configure**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && REACT_APP_API_URL=https://your-backend-url.com/api npm run build`
   - **Output Directory**: `build`

4. **Add Environment Variable**:
   - `REACT_APP_API_URL` = `https://your-backend-url.com/api`

---

## Quick Setup Script

Create a file `deploy.sh` in the root directory:

```bash
#!/bin/bash

# Set your backend URL here
BACKEND_URL="https://your-backend-name.onrender.com"

echo "Building frontend with backend URL: $BACKEND_URL"
cd frontend
export REACT_APP_API_URL="$BACKEND_URL/api"
npm install
npm run build
echo "Build complete! Deploy the 'build' folder to your hosting service."
```

Make it executable: `chmod +x deploy.sh`

---

## Testing Your Deployment

1. **Test backend directly**: Visit `https://your-backend-url.com/api/models`
   - Should return JSON with 3 model cards

2. **Test frontend**: Visit your frontend URL
   - Should show 3 model cards
   - Search should work
   - Interactive demos should work

---

## Troubleshooting

### CORS Errors
- Backend already has CORS enabled for all origins
- If issues persist, check that `flask-cors` is installed

### API Not Found
- Make sure `REACT_APP_API_URL` includes `/api` at the end
- Check browser console (F12) for actual API calls being made

### Build Fails
- Make sure all dependencies are in `package.json` and `requirements.txt`
- Check that Node.js and Python versions are compatible

### Services Timeout
- Free tiers may have cold starts (first request takes longer)
- Consider upgrading to paid tier for always-on service

---

## Recommended: Render (Easiest)

For the simplest deployment:
1. Deploy backend as Web Service on Render
2. Deploy frontend as Static Site on Render
3. Set `REACT_APP_API_URL` environment variable in frontend
4. Share your frontend URL!

Total time: ~15 minutes. Both services free on their free tier.

