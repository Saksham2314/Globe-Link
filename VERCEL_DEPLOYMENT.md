# Deploying Globe Link Frontend to Vercel

## Step-by-Step Instructions

### 1. Create a Vercel Account
Go to https://vercel.com and create a free account (if you don't have one)

### 2. Install Vercel CLI
The CLI has been installed globally on your system.

### 3. Login to Vercel
Run the following command in your terminal:
```bash
vercel login
```
This will open your browser for authentication. Follow the prompts.

### 4. Deploy Your Frontend
Navigate to your frontend directory and run:
```bash
cd "c:\Users\Saksh\OneDrive\Desktop\SE Project\globe-link\frontend"
vercel --prod
```

### 5. Follow the Prompts
When prompted:
- **Project name**: `globe-link` (or your preferred name)
- **Directory**: `./` (current directory)
- **Build command**: `npm run build` (should be detected automatically)
- **Output directory**: `dist`
- **Install dependencies**: Yes

### 6. Environment Variables
After deployment, go to Vercel Dashboard:
1. Select your project
2. Go to Settings → Environment Variables
3. Add:
   - Key: `VITE_API_URL`
   - Value: `https://globe-link.onrender.com/api`

### 7. Redeploy
After adding environment variables, redeploy:
```bash
vercel --prod
```

## Your Frontend URL
After deployment, Vercel will provide you with a URL like:
`https://globe-link.vercel.app`

## Important Notes
- The backend is already deployed on Render at `https://globe-link.onrender.com`
- Your vite.config.js is already configured to proxy API calls to the backend
- The vercel.json file handles routing for React Router

## Troubleshooting
If you encounter issues:
1. Make sure all dependencies are installed: `npm install`
2. Verify the build works locally: `npm run build`
3. Check that the backend is running and accessible
4. Review Vercel deployment logs in the dashboard
