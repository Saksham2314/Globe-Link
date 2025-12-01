# Vercel Deployment Guide

## ✅ Changes Made for Production

1. **Created API Base URL Utility** (`src/utils/apiClient.js`)
   - Automatically detects production vs development
   - Uses full backend URL (`https://globe-link.onrender.com/api`) in production
   - Uses relative path `/api` in development (proxy works locally)

2. **Updated All Pages & Components**
   - Home, Login, Register, PostJourney, JourneyDetail, EditJourney
   - Chats, TravelerDashboard, SeekerDashboard
   - Navbar, JourneyCard components
   - All now use `API_BASE_URL` for API calls

3. **Environment Files**
   - `.env.production` created with production API URL
   - Works seamlessly with Vercel auto-detection

## 🚀 Deploy to Vercel (Simple Steps)

### Option 1: Using Vercel Dashboard (Easiest)
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository `Saksham2314/Globe-Link`
4. Vercel will auto-detect Vite framework
5. Click "Deploy"
6. Done! ✅

### Option 2: Using Vercel CLI
```bash
# Make sure you're in frontend directory
cd "c:\Users\Saksh\OneDrive\Desktop\SE Project\globe-link\frontend"

# Login (opens browser)
vercel login

# Deploy to production
vercel --prod

# Follow the prompts and confirm
```

## 📋 What Happens Next

1. Vercel clones your repo
2. Installs dependencies (`npm install`)
3. Builds with `npm run build`
4. Deploys `dist/` folder to global CDN
5. Gives you a URL like: `https://globe-link.vercel.app`

## ✨ Your Frontend Will:
- ✅ Connect to backend at `https://globe-link.onrender.com`
- ✅ Handle routing correctly (vercel.json configured)
- ✅ Use environment variables
- ✅ Auto-redeploy on every GitHub push

## 🔗 Live Links (After Deployment)
- **Frontend**: https://globe-link.vercel.app (your new URL)
- **Backend**: https://globe-link.onrender.com (already deployed)
- **GitHub**: https://github.com/Saksham2314/Globe-Link

## ⚠️ If You Get Errors After Deployment

### "JSON Error" or "Cannot fetch API"
- Make sure backend at `https://globe-link.onrender.com` is running
- Check backend logs in Render dashboard
- Verify `API_BASE_URL` is using full Render URL

### "Page not found" 404 Errors
- `vercel.json` handles this with rewrites
- Should work automatically

### Dark mode not working
- Clear browser cache (Ctrl+Shift+Delete)
- localStorage persists across deployments

## 📱 Share Your App
Once deployed, share the Vercel URL with others:
```
Hey, try my travel platform! https://globe-link.vercel.app
```

## 🎉 Congratulations!
Your Globe Link platform is now live on Vercel! 🚀
