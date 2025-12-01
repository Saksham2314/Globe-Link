# 🧠 Globe Link - Configuration Checklist

Use this checklist to ensure everything is properly configured before running the application.

---

## ✅ Prerequisites

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional but recommended)
- [ ] MongoDB Atlas account created
- [ ] Code editor (VS Code recommended)

---

## 🗄️ Database Setup

### MongoDB Atlas Configuration

- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created
- [ ] Database user created (username & password)
- [ ] Connection string copied
- [ ] IP whitelist configured (0.0.0.0/0 for development)
- [ ] Connection format verified:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/globe-link?retryWrites=true&w=majority
  ```

---

## 🔧 Backend Configuration

### Dependencies & Setup

- [ ] Backend folder exists: `backend/`
- [ ] Dependencies installed: `npm install`
- [ ] `.env` file created in `backend/` folder
- [ ] All required environment variables in `.env`:
  - [ ] `PORT=5000`
  - [ ] `MONGODB_URI=...` (from MongoDB Atlas)
  - [ ] `JWT_SECRET=...` (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
  - [ ] `NODE_ENV=development`
  - [ ] `FRONTEND_URL=http://localhost:5173`

### File Structure Check

- [ ] `backend/config/db.js` ✅
- [ ] `backend/models/User.js` ✅
- [ ] `backend/models/Journey.js` ✅
- [ ] `backend/models/Chat.js` ✅
- [ ] `backend/models/Message.js` ✅
- [ ] `backend/controllers/authController.js` ✅
- [ ] `backend/controllers/journeyController.js` ✅
- [ ] `backend/controllers/chatController.js` ✅
- [ ] `backend/middleware/auth.js` ✅
- [ ] `backend/routes/auth.js` ✅
- [ ] `backend/routes/journeys.js` ✅
- [ ] `backend/routes/chats.js` ✅
- [ ] `backend/server.js` ✅
- [ ] `backend/package.json` ✅

### Startup Test

- [ ] Run `npm run dev` in backend folder
- [ ] See message: "Server running on port 5000"
- [ ] See message: "MongoDB Connected: ..."
- [ ] Test health endpoint: `curl http://localhost:5000/api/health`
- [ ] Receive: `{"message":"Server is running"}`

---

## ⚛️ Frontend Configuration

### Dependencies & Setup

- [ ] Frontend folder exists: `frontend/`
- [ ] Dependencies installed: `npm install`
- [ ] `.env.local` file created in `frontend/` folder
- [ ] All required environment variables in `.env.local`:
  - [ ] `VITE_API_URL=http://localhost:5000/api`
  - [ ] `VITE_APP_NAME=Globe Link`

### File Structure Check

- [ ] `frontend/src/App.jsx` ✅
- [ ] `frontend/src/main.jsx` ✅
- [ ] `frontend/src/index.css` ✅
- [ ] `frontend/src/components/Hero.jsx` ✅
- [ ] `frontend/src/components/Navbar.jsx` ✅
- [ ] `frontend/src/components/JourneyCard.jsx` ✅
- [ ] `frontend/src/components/SearchBar.jsx` ✅
- [ ] `frontend/src/pages/Home.jsx` ✅
- [ ] `frontend/src/pages/Login.jsx` ✅
- [ ] `frontend/src/pages/Register.jsx` ✅
- [ ] `frontend/src/pages/PostJourney.jsx` ✅
- [ ] `frontend/src/pages/JourneyDetail.jsx` ✅
- [ ] `frontend/src/pages/Chats.jsx` ✅
- [ ] `frontend/index.html` ✅
- [ ] `frontend/vite.config.js` ✅
- [ ] `frontend/tailwind.config.js` ✅
- [ ] `frontend/postcss.config.js` ✅
- [ ] `frontend/package.json` ✅

### Startup Test

- [ ] Run `npm run dev` in frontend folder
- [ ] See message: "VITE v5.0.0 ready in xxx ms"
- [ ] See message: "Local: http://localhost:5173/"
- [ ] Open browser and navigate to `http://localhost:5173`
- [ ] Page loads without errors

---

## 🔗 Integration Check

### Backend & Frontend Connection

- [ ] Both servers running (backend on 5000, frontend on 5173)
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Navigate to any page
- [ ] No CORS errors in console
- [ ] API calls show status 200 (or expected status)

### API Endpoint Testing (Postman or curl)

**Register Test:**
- [ ] Run: `POST http://localhost:5000/api/auth/register`
- [ ] Body: 
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123456",
    "userType": "traveler"
  }
  ```
- [ ] Response: 201 status with token and user data

**Login Test:**
- [ ] Run: `POST http://localhost:5000/api/auth/login`
- [ ] Body:
  ```json
  {
    "email": "test@example.com",
    "password": "Test@123456"
  }
  ```
- [ ] Response: 200 status with token and user data

**Get Journeys Test:**
- [ ] Run: `GET http://localhost:5000/api/journeys`
- [ ] Response: 200 status with journeys array

---

## 🧪 Functional Testing

### User Registration Flow

- [ ] Open `http://localhost:5173`
- [ ] Click "Get Started" or "Create Account"
- [ ] Fill in registration form:
  - [ ] Name: Valid name
  - [ ] Email: Valid email
  - [ ] Password: 6+ characters
  - [ ] Type: Traveler
- [ ] Click "Create Account"
- [ ] Successfully redirected to journeys page
- [ ] User logged in (profile icon shows)

### User Login Flow

- [ ] Click logout/profile menu
- [ ] Log out successfully
- [ ] Redirected to home page
- [ ] Click "Login"
- [ ] Enter email and password
- [ ] Click "Sign In"
- [ ] Successfully logged back in

### Traveler Journey Posting

- [ ] Log in as traveler
- [ ] Click "Post Journey"
- [ ] Fill form with:
  - [ ] Title
  - [ ] Description
  - [ ] From & To locations
  - [ ] Start & End dates
  - [ ] Budget level
  - [ ] Highlights (add multiple)
- [ ] Click "Publish Journey"
- [ ] Redirected to journeys page
- [ ] New journey appears in list

### Seeker Browsing

- [ ] Log in as seeker
- [ ] View journeys on "Journeys" page
- [ ] Search by keyword
- [ ] Filter by location
- [ ] Click on journey card
- [ ] View full journey details
- [ ] See traveler information
- [ ] "Chat" button visible

### Chat Functionality

- [ ] Click "Chat" on a journey
- [ ] Chat window opens
- [ ] Type message
- [ ] Send message
- [ ] Message appears in chat
- [ ] View chats in "Messages" page
- [ ] Chat history visible

---

## 📊 Database Check

### MongoDB Atlas Verification

- [ ] Log into MongoDB Atlas
- [ ] Navigate to Clusters → Collections
- [ ] Verify database `globe-link` exists
- [ ] Collections created:
  - [ ] `users`
  - [ ] `journeys`
  - [ ] `chats`
  - [ ] `messages`

### Sample Data Check

After testing, verify in MongoDB Atlas:
- [ ] Users collection has registered users
- [ ] Journeys collection has posted journeys
- [ ] Passwords are hashed (not plain text)
- [ ] Timestamps are correct

---

## 🚀 Performance Check

- [ ] Frontend loads in < 3 seconds
- [ ] Smooth animations without lag
- [ ] No console errors
- [ ] No memory leaks (check DevTools)
- [ ] Responsive on mobile (test with DevTools)
- [ ] Images load properly

---

## 🔐 Security Check

- [ ] Passwords are hashed in database
- [ ] JWT tokens in localStorage
- [ ] Protected routes require authentication
- [ ] Travelers can only edit their journeys
- [ ] CORS allows correct origins
- [ ] No API keys exposed in frontend code

---

## 📱 Responsive Design Check

- [ ] Test on mobile (DevTools)
- [ ] Navbar collapses properly
- [ ] Cards stack vertically
- [ ] Forms are readable
- [ ] Buttons are clickable
- [ ] Images scale properly

---

## 🐛 Debugging & Troubleshooting

- [ ] Backend terminal shows no errors
- [ ] Frontend terminal shows no errors
- [ ] Browser console has no red errors
- [ ] Network tab shows successful requests
- [ ] MongoDB connection is stable
- [ ] .env files contain all required variables

---

## ✨ Final Verification

Before considering MVP complete:

- [ ] All files are in correct locations
- [ ] All environment variables are configured
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Both servers can communicate
- [ ] User can register and login
- [ ] Travelers can post journeys
- [ ] Seekers can browse journeys
- [ ] Chat functionality works
- [ ] No console errors in DevTools
- [ ] Responsive design verified
- [ ] All documentation is present

---

## 📋 Pre-Deployment Checklist

When ready to deploy:

- [ ] Set `NODE_ENV=production` in backend
- [ ] Generate strong JWT_SECRET
- [ ] Use production MongoDB URI
- [ ] Set correct FRONTEND_URL
- [ ] Update VITE_API_URL to production URL
- [ ] Run `npm run build` for frontend
- [ ] Test production build locally
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Test on production URL
- [ ] Monitor logs for errors

---

## 🎉 You're Ready!

Once all checkboxes are complete, your Globe Link MVP is fully configured and ready to use!

**Next Steps:**
1. ✅ Complete this checklist
2. 📖 Read the documentation files
3. 🚀 Deploy to production
4. 📊 Gather user feedback
5. 🔄 Iterate and improve

---

**Happy coding! 🚀✈️🌍**
