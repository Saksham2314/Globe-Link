# Globe Link - Travel Connection Platform

A modern web application that connects travelers who have completed specific journeys with those planning the same routes. Built with React.js, Node.js/Express, and MongoDB.

## 🌟 Features

### For Travelers
- **Post Journeys**: Share detailed travel experiences with descriptions, highlights, and photos
- **Manage Profile**: Create a profile showcasing your travel experience
- **Direct Chat**: Connect with seekers interested in your journeys
- **Journey Analytics**: Track views and engagement on your posts

### For Seekers
- **Browse Journeys**: Explore journeys with advanced search and filtering
- **Search & Filter**: Find specific routes, dates, budget levels, and highlights
- **Direct Communication**: Chat with experienced travelers for advice
- **Real Insights**: Get authentic advice from people who've been there

## 🏗️ Architecture

```
globe-link/
├── frontend/                 # React.js SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── context/          # State management
│   │   ├── hooks/            # Custom React hooks
│   │   └── assets/           # Static assets
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS config
│   └── package.json
│
└── backend/                  # Express.js API
    ├── controllers/          # Business logic
    ├── models/               # MongoDB schemas
    ├── routes/               # API routes
    ├── middleware/           # Auth & validation
    ├── config/               # Database config
    ├── server.js             # Entry point
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/globe-link
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local` file**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Globe Link
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   App runs on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Journeys
- `GET /api/journeys` - Get all journeys (with search/filter)
- `GET /api/journeys/:id` - Get journey details
- `POST /api/journeys` - Create journey (traveler only)
- `PUT /api/journeys/:id` - Update journey
- `DELETE /api/journeys/:id` - Delete journey
- `GET /api/journeys/my-journeys` - Get user's journeys

### Chat
- `POST /api/chats` - Create/start chat
- `GET /api/chats` - Get user's chats
- `GET /api/chats/:id` - Get chat details
- `POST /api/chats/:id/message` - Send message

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  userType: enum['traveler', 'seeker'],
  profileImage: String,
  bio: String,
  location: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Journey
```javascript
{
  title: String,
  description: String,
  startLocation: String,
  endLocation: String,
  startDate: Date,
  endDate: Date,
  duration: Number,
  traveler: ObjectId (ref: User),
  highlights: [String],
  budget: enum['budget', 'moderate', 'luxury'],
  transportation: [String],
  images: [String],
  rating: Number,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Chat
```javascript
{
  participants: [ObjectId],
  journey: ObjectId (optional),
  messages: [ObjectId (ref: Message)],
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  chat: ObjectId (ref: Chat),
  sender: ObjectId (ref: User),
  content: String,
  read: Boolean,
  createdAt: Date
}
```

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, sleek interface with gradient backgrounds
- **Globe Background**: Animated SVG globe in hero section
- **Responsive**: Mobile-friendly design using Tailwind CSS
- **Smooth Animations**: Blob animations and smooth transitions
- **Dark & Light Modes**: Easily customizable themes
- **Glass Morphism**: Modern glassmorphic UI elements

## 🔐 Security

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcryptjs for password encryption
- **Protected Routes**: Role-based access control
- **CORS**: Configured for security
- **Input Validation**: Server-side validation on all endpoints

## 📦 Technologies Used

### Frontend
- React.js 18
- React Router v6
- Vite (build tool)
- Tailwind CSS
- Lucide Icons
- Axios (HTTP client)
- Zustand (state management)

### Backend
- Express.js
- MongoDB
- Mongoose (ODM)
- JWT (authentication)
- bcryptjs (password hashing)
- CORS middleware

## 🚀 Deployment

### Backend (Heroku)
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables
5. Deploy: `git push heroku main`

### Frontend (Vercel)
1. Install Vercel CLI
2. Deploy: `vercel`
3. Set environment variables in dashboard

## 🎯 MVP Features

✅ User authentication (Register/Login)
✅ Two user roles (Traveler/Seeker)
✅ Journey posting and browsing
✅ Advanced search and filtering
✅ Real-time chat system
✅ User profiles
✅ Responsive design
✅ Modern UI with globe background

## 🔮 Future Enhancements

- [ ] AI-powered journey recommendations
- [ ] GPT/Gemini integration for smart suggestions
- [ ] Photo gallery for journeys
- [ ] Video testimonials
- [ ] Rating and reviews system
- [ ] Journey booking integration
- [ ] Group journeys
- [ ] Real-time notifications
- [ ] Weather integration
- [ ] Travel alerts and tips automation

## 👨‍💻 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For support, email support@globelink.com or open an issue on GitHub.

## 👥 Team

Built with ❤️ for travelers, by travelers.

---

**Happy Traveling! 🌍✈️**
