# Deployment Guide to Render

This guide will help you deploy your AI Driven DSA application to Render.

## Prerequisites

1. **GitHub Account**: Your code is already pushed to GitHub
2. **MongoDB Atlas Account**: Already connected (you're using MongoDB Atlas)
3. **Render Account**: Create a free account at https://render.com

## Step-by-Step Deployment

### 1. Prepare Your Repository (Local)

```bash
# Make sure all files are committed and pushed to GitHub
git add .
git commit -m "Add deployment configuration"
git push origin main
```

The following new files have been added:
- `render.yaml` - Render configuration
- `backend/.env.example` - Environment variables template

### 2. Create a Render Account

- Go to https://render.com
- Sign up with GitHub (recommended for easy integration)
- Authorize Render to access your GitHub repositories

### 3. Create a New Web Service on Render

1. Click **New +** → **Web Service**
2. Select your `AI Driven DSA` repository from GitHub
3. Configure the service:
   - **Name**: `ai-driven-dsa` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: `Oregon` (or closest to you)
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Paid if you prefer faster builds)

### 4. Add Environment Variables

In the Render dashboard for your service:

1. Go to **Environment** section
2. Add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `MONGO_URI` | Your MongoDB Atlas connection string | Get from MongoDB Atlas dashboard |
| `JWT_SECRET` | Your JWT secret | Use a strong, random string |
| `PORT` | `5000` | Optional (Render will set this) |

### 5. How to Get Your MongoDB Atlas Connection String

1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Log in to your account
3. Go to **Clusters** → Click **Connect**
4. Select **Drivers** → **Node.js**
5. Copy the connection string and replace:
   - `<username>` with your MongoDB username
   - `<password>` with your MongoDB password
   - Keep the rest as-is

Example: `mongodb+srv://user:password@cluster0.abc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

### 6. Deploy

Once you've added all environment variables:

1. Click **Deploy Web Service**
2. Render will automatically:
   - Build your frontend (creates dist folder)
   - Install backend dependencies
   - Start your server
3. Your app will be live at `https://your-service-name.onrender.com`

### 7. Important Notes

- **First deployment takes 10-15 minutes** - Be patient!
- **Free tier limitations**: 
  - Service spins down after 15 minutes of inactivity (first request takes ~30 seconds)
  - Upgrade to a paid plan for always-on service
- **MongoDB Atlas free tier**: Limited storage (512MB), perfect for testing
- **View logs**: In Render dashboard → **Logs** tab to debug issues

### 8. Accessing Your Application

Once deployed, your app is available at: `https://your-service-name.onrender.com`

- Frontend: `https://your-service-name.onrender.com`
- Backend API: `https://your-service-name.onrender.com/api/*`

### Troubleshooting

**Build fails?**
- Check the **Build Logs** in Render dashboard
- Ensure `frontend/dist` is created before backend starts
- Verify all dependencies are in `package.json`

**App crashes after deploy?**
- Check **Runtime Logs** in Render dashboard
- Verify `MONGO_URI` environment variable is correct
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all IPs)

**Frontend not loading?**
- Check that `NODE_ENV=production` is set
- Verify frontend build succeeded in logs

## Quick Reference: Environment File

See `backend/.env.example` for the required environment variables.

