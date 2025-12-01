# Production Setup Guide

## Overview

Your Globe Link frontend is now configured to work seamlessly in both development and production environments.

## Development (npm run dev)

- Vite proxy automatically routes `/api/*` requests to your backend
- Uses the proxy defined in `vite.config.js`
- No additional configuration needed
- **Backend must be running** on the configured backend URL

## Production (npm run build)

Your frontend will now work correctly on Vercel and other deployment platforms.

### Configuration

The application uses environment variables to determine the API base URL:

- **Development**: Relative URLs (proxy handled by Vite)
- **Production**: Uses `VITE_API_URL` environment variable

### Setup Instructions

#### 1. Local Development

Create `.env.local` in the `frontend/` directory:

```
VITE_API_URL=http://localhost:3000
```

This tells the app to use your local backend server.

#### 2. Vercel Deployment

Add the following environment variable in your Vercel project settings:

**Environment Variable:**
- **Name:** `VITE_API_URL`
- **Value:** `https://globe-link.onrender.com` (or your actual backend URL)

#### 3. Alternative Platforms

For other hosting platforms (Netlify, etc.), set the environment variable to your backend API URL:

```
VITE_API_URL=https://your-backend-url.com
```

## How It Works

### Development Flow

```
Frontend (localhost:5173)
    ↓
Vite Proxy intercepts /api/* requests
    ↓
Routes to Backend (localhost:3000 by default)
    ↓
Response returned
```

### Production Flow

```
Frontend (vercel.app or your domain)
    ↓
API utility checks import.meta.env.DEV
    ↓
DEV is false, so uses VITE_API_URL environment variable
    ↓
Requests sent to configured backend URL
    ↓
Response returned
```

## Files Modified

The following files have been updated to support production:

### New Files Created

- **`src/utils/api.js`** - API utility that handles base URL configuration
- **`.env.local`** - Local environment variables (development)
- **`.env.example`** - Template for environment variables
- **`vercel.json`** - Vercel configuration with API rewrite rules

### Updated Files

All pages and components that made API calls have been updated to use the new `getApiBaseUrl()` function:

- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/Home.jsx`
- `src/pages/Chats.jsx`
- `src/pages/JourneyDetail.jsx`
- `src/pages/EditJourney.jsx`
- `src/pages/PostJourney.jsx`
- `src/pages/SeekerDashboard.jsx`
- `src/pages/TravelerDashboard.jsx`
- `src/components/Navbar.jsx`

## Usage in Code

Before:
```javascript
const response = await fetch('/api/chats', {...});
```

After:
```javascript
import { getApiBaseUrl } from '../utils/api';

const baseUrl = getApiBaseUrl();
const response = await fetch(`${baseUrl}/api/chats`, {...});
```

## Troubleshooting

### API calls fail after deployment

1. **Check environment variable:** Verify `VITE_API_URL` is set correctly
2. **Check CORS:** Ensure your backend allows requests from your frontend domain
3. **Check backend URL:** Verify the backend is running and accessible
4. **Check network:** Use browser DevTools to see the actual request URL

### "Cannot find module" errors

If you see import errors, ensure `.env.local` exists and has the correct variable names with `VITE_` prefix.

## Deploying to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variable `VITE_API_URL` in Vercel dashboard
4. Deploy

The frontend will automatically use the production API URL when deployed.

## Backend Deployment

Ensure your backend is deployed and the URL is:
1. Publicly accessible
2. CORS-enabled for your frontend domain
3. Environment variable is set in Vercel project settings

---

**For Support:** Check that both frontend and backend are running correctly and can communicate with each other.
