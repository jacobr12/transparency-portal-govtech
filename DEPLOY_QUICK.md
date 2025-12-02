# Quick Deployment Guide

## Easiest Method: Render (Free, ~15 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `transparency-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Click "Create Web Service"
6. **Copy the URL** (e.g., `https://transparency-backend.onrender.com`)

### Step 3: Deploy Frontend on Render

1. In Render, click "New +" → "Static Site"
2. Connect same GitHub repo
3. Configure:
   - **Name**: `transparency-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && REACT_APP_API_URL=https://YOUR-BACKEND-URL.onrender.com/api npm run build`
     - Replace `YOUR-BACKEND-URL` with the URL from Step 2
   - **Publish Directory**: `build`
4. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://YOUR-BACKEND-URL.onrender.com/api`
5. Click "Create Static Site"
6. **Copy the frontend URL** - this is your shareable link!

### Done! 🎉

Share your frontend URL with friends. The site will work automatically.

---

## Alternative: Railway (Also Free)

1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Add two services:
   - **Backend**: Root = `backend`, auto-detects Python
   - **Frontend**: Root = `frontend`, Build = `npm install && REACT_APP_API_URL=https://YOUR-BACKEND.up.railway.app/api npm run build`
4. Set `REACT_APP_API_URL` environment variable in frontend service

---

## Testing

1. Test backend: Visit `https://your-backend-url.com/api/models` - should show JSON
2. Test frontend: Visit your frontend URL - should show 3 model cards

---

## Troubleshooting

- **CORS errors**: Already handled in code
- **API not found**: Make sure `REACT_APP_API_URL` ends with `/api`
- **Slow first load**: Free tier services "sleep" after inactivity - first request takes 30-60 seconds

