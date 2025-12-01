# Globe Link Frontend

Modern React.js SPA for Globe Link travel connection platform using Vite, React Router, Tailwind CSS.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Globe Link
```

For production, create `.env.production`:
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=Globe Link
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Hero.jsx          # Landing hero section with globe
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── JourneyCard.jsx   # Journey card component
│   │   └── SearchBar.jsx     # Search & filter component
│   ├── pages/
│   │   ├── Home.jsx          # Home/journeys list page
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── PostJourney.jsx   # Create journey page
│   │   ├── JourneyDetail.jsx # Journey details page
│   │   └── Chats.jsx         # Messages page
│   ├── services/
│   │   └── api.js            # API client configuration
│   ├── context/
│   │   └── AuthContext.js    # Auth state (optional)
│   ├── hooks/
│   │   └── useAuth.js        # Custom hooks
│   ├── assets/               # Images, icons, etc.
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles & Tailwind
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
├── package.json
└── .env.local
```

## Pages & Routes

### Public Routes
- `/` - Home page with hero section
- `/journeys` - Browse all journeys
- `/journey/:id` - Journey details
- `/login` - User login
- `/register` - User registration

### Protected Routes (Require Login)
- `/post-journey` - Post a new journey (traveler only)
- `/chats` - View all conversations
- `/profile` - User profile (coming soon)

## Components

### Hero.jsx
Landing section with animated globe background and call-to-action buttons.

### Navbar.jsx
Navigation bar with:
- Logo and branding
- Links to main sections
- User menu with logout
- "Post Journey" button for travelers
- Responsive mobile menu

### JourneyCard.jsx
Displays journey summary with:
- Title and duration
- Budget badge
- Description preview
- Highlights
- Traveler info
- Chat button

### SearchBar.jsx
Search and filter journeys by:
- Keywords (search)
- Location
- Date range
- Budget level

## State Management

Using React Context + localStorage for simplicity:

```javascript
// User stored in localStorage
localStorage.setItem('user', JSON.stringify(user));
localStorage.setItem('token', token);

// Retrieved on app load
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
```

For larger apps, consider adding Zustand or Redux.

## API Integration

### Base Setup
```javascript
const API_URL = import.meta.env.VITE_API_URL;

// Example fetch with auth
const response = await fetch(`${API_URL}/journeys`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Common Requests

**Login:**
```javascript
POST /auth/login
{ email, password }
```

**Create Journey:**
```javascript
POST /journeys
{ title, description, startLocation, endLocation, ... }
```

**Get Journeys:**
```javascript
GET /journeys?search=Paris&location=France
```

**Send Message:**
```javascript
POST /chats/:id/message
{ content }
```

## Styling

### Tailwind CSS Classes

```javascript
// Button variants
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>

// Input
<input className="input-field" />

// Card
<div className="card p-6">...</div>

// Glass effect
<div className="glass">...</div>
```

### Custom Animations

```css
/* Hero blob animation */
.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
```

## User Authentication Flow

1. **Register**
   - User fills form (name, email, password, type)
   - POST to `/auth/register`
   - Receive JWT token
   - Store token & user in localStorage
   - Redirect to journeys page

2. **Login**
   - User fills form (email, password)
   - POST to `/auth/login`
   - Receive JWT token
   - Store token & user in localStorage
   - Redirect to journeys page

3. **Protected Routes**
   - Check localStorage for token
   - If missing, redirect to login
   - Include token in request headers

4. **Logout**
   - Clear localStorage
   - Redirect to home/login

## Development Workflow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: `http://localhost:5173`
4. Make changes and see hot reload
5. Test with Postman or browser DevTools

## Building for Production

```bash
npm run build
```

Creates optimized files in `dist/` folder.

To preview production build:
```bash
npm run preview
```

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set output directory: `dist`

### Docker
```bash
docker build -t globe-link-frontend .
docker run -p 5173:5173 globe-link-frontend
```

## Performance Tips

- Lazy load routes with React.lazy()
- Optimize images with next-gen formats
- Use React DevTools Profiler
- Monitor bundle size with `npm run build -- --stats`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Port already in use
```bash
# On Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### CORS errors
- Check backend CORS configuration
- Ensure VITE_API_URL matches backend URL
- Restart both servers

### Hot reload not working
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Restart dev server

### Token expired
- Automatically logout user
- Redirect to login page
- Ask user to login again

## Popular Extensions

### ESLint Setup
```bash
npm install --save-dev eslint eslint-plugin-react
```

### Prettier
```bash
npm install --save-dev prettier
```

## Resources

- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Docs](https://react.dev)

## Support

For issues, check the main README.md or contact support@globelink.com
