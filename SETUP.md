# 🚀 Globe Link - Setup & Installation Guide

## Overview

Globe Link is a modern travel connection platform with:
- **Frontend**: React.js + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas

**Estimated Setup Time**: 15-20 minutes

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up" and create an account
3. Verify your email

### 1.2 Create a Cluster
1. Click "Create a Deployment"
2. Select **M0 (Free)** tier
3. Choose your region (closest to you)
4. Click "Create Deployment"

### 1.3 Get Connection String
1. Go to Database → Clusters
2. Click "Connect" on your cluster
3. Select "Drivers" → "Node.js"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>`, `<password>`, and add database name: `globe-link`
   ```
   mongodb+srv://username:password@cluster.mongodb.net/globe-link?retryWrites=true&w=majority
   ```

### 1.4 Create Database User (if not already created)
1. In MongoDB Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Click "Add User"
5. Go to "Network Access" and add your IP (or 0.0.0.0/0 for development)

---

## Step 2: Backend Setup

### 2.1 Clone/Navigate to Backend
```bash
cd backend
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Create `.env` File

Create a new file `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/globe-link?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_random
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: cluster.mongodb.net
```

**Test the server:**
```bash
curl http://localhost:5000/api/health
```

---

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend
```bash
cd frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Create `.env.local` File

Create a new file `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Globe Link
```

### 3.4 Start Frontend Server
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## Step 4: Test the Application

### 4.1 Open in Browser
Navigate to: `http://localhost:5173`

### 4.2 Create Test Accounts

**Create a Traveler Account:**
1. Click "Get Started" or "Create Account"
2. Fill in:
   - Name: `John Traveler`
   - Email: `traveler@test.com`
   - Password: `Test@123456`
   - User Type: **Traveler**
3. Click "Create Account"

**Create a Seeker Account:**
1. Log out
2. Click "Create Account"
3. Fill in:
   - Name: `Jane Seeker`
   - Email: `seeker@test.com`
   - Password: `Test@123456`
   - User Type: **Seeker**
4. Click "Create Account"

### 4.3 Test Features

**As Traveler:**
1. Click "Post Journey" button
2. Fill in journey details:
   - Title: "Paris to Rome Adventure"
   - Description: "Amazing 2-week journey through Europe"
   - From: "Paris, France"
   - To: "Rome, Italy"
   - Dates: Any dates in the future
   - Budget: "Moderate"
   - Highlights: Add "Eiffel Tower", "Swiss Alps", etc.
3. Click "Publish Journey"

**As Seeker:**
1. Go to "Journeys" page
2. See your posted journey
3. Try searching by location or keyword
4. Click "Chat" button to initiate conversation

---

## Step 5: Development Workflow

### 5.1 Running Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### 5.2 Making Code Changes

- Backend: Changes auto-reload with nodemon
- Frontend: Changes auto-reload with Vite HMR

### 5.3 Debugging

**Backend:**
- Check terminal for logs
- Use `console.log()` for debugging
- MongoDB Atlas Dashboard for database inspection

**Frontend:**
- Open DevTools (F12)
- Use React DevTools extension
- Check Network tab for API calls

---

## Troubleshooting

### Issue: MongoDB Connection Failed

**Solution:**
1. Check MONGODB_URI in `.env` is correct
2. Verify username and password
3. Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0)
4. Test connection:
   ```bash
   node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected!')).catch(e => console.error(e))"
   ```

### Issue: CORS Error in Browser Console

**Solution:**
1. Ensure backend is running on port 5000
2. Check VITE_API_URL in `.env.local`
3. Restart both servers

### Issue: Port Already in Use

**On Windows:**
```bash
netstat -ano | findstr :5000  # or :5173 for frontend
taskkill /PID <PID> /F
```

**On Mac/Linux:**
```bash
lsof -ti:5000 | xargs kill -9  # or :5173
```

### Issue: npm modules not installing

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Clear npm cache if needed
npm cache clean --force
```

---

## Environment Variables Explained

### Backend (.env)
| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `NODE_ENV` | Environment (development/production) |
| `FRONTEND_URL` | Frontend origin for CORS |

### Frontend (.env.local)
| Variable | Purpose |
| `VITE_API_URL` | Backend API URL |
| `VITE_APP_NAME` | App display name |

---

## API Testing with Postman

### Import Collection
1. Open Postman
2. Create new request
3. Test endpoints:

**Register:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@123456",
  "userType": "traveler"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@123456"
}
```

**Get Journeys:**
```
GET http://localhost:5000/api/journeys
```

---

## Next Steps

### 🎯 Customization
1. Update colors in `tailwind.config.js`
2. Modify components in `src/components/`
3. Add new pages in `src/pages/`
4. Implement additional features

### 🚀 Deployment
- **Backend**: Deploy to Heroku, Railway, or AWS
- **Frontend**: Deploy to Vercel, Netlify, or AWS

### 🤖 Future Features
- AI journey recommendations
- Real-time notifications
- Photo uploads
- Rating and reviews
- Booking integration

---

## Project Structure Quick Reference

```
globe-link/
├── backend/
│   ├── models/          (Database schemas)
│   ├── controllers/     (Business logic)
│   ├── routes/          (API endpoints)
│   ├── middleware/      (Auth, validation)
│   ├── config/          (Database config)
│   ├── server.js        (Entry point)
│   └── .env             (Environment variables)
│
└── frontend/
    ├── src/
    │   ├── components/  (Reusable UI)
    │   ├── pages/       (Page components)
    │   ├── App.jsx      (Main app)
    │   └── index.css    (Global styles)
    ├── index.html
    ├── vite.config.js
    └── .env.local
```

---

## Quick Commands Reference

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev         # Start development server
npm run start       # Start production server

# Frontend
cd frontend
npm install         # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## Support & Resources

- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **MongoDB Docs**: https://docs.mongodb.com
- **Tailwind CSS**: https://tailwindcss.com

---

## 🎉 You're All Set!

Your Globe Link application is now running. Start exploring and building!

**Happy Coding! 🚀✈️🌍**
