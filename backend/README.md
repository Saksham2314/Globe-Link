# Globe Link Backend

Express.js API server for Globe Link platform with MongoDB integration.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/globe-link
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### MongoDB Setup (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `username`, `password`, and `cluster` in MONGODB_URI

#### JWT Secret
Generate a secure secret key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 4. API Health Check

```bash
curl http://localhost:5000/api/health
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Auth logic
│   ├── journeyController.js # Journey logic
│   └── chatController.js  # Chat logic
├── middleware/
│   └── auth.js            # JWT verification & authorization
├── models/
│   ├── User.js            # User schema
│   ├── Journey.js         # Journey schema
│   ├── Chat.js            # Chat schema
│   └── Message.js         # Message schema
├── routes/
│   ├── auth.js            # Auth endpoints
│   ├── journeys.js        # Journey endpoints
│   └── chats.js           # Chat endpoints
├── server.js              # Express app entry point
├── package.json
└── .env                   # Environment variables
```

## API Routes

### Authentication Routes (`/api/auth`)

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "userType": "traveler" // or "seeker"
}

Response: { token, user }
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: { user }
```

### Journey Routes (`/api/journeys`)

#### Get All Journeys (with search/filter)
```
GET /api/journeys?search=Paris&location=France&startDate=2024-01-01

Response: { count, journeys }
```

#### Get Journey by ID
```
GET /api/journeys/:id

Response: { journey }
```

#### Create Journey (Traveler only)
```
POST /api/journeys
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Paris to Rome",
  "description": "Amazing 2-week journey...",
  "startLocation": "Paris, France",
  "endLocation": "Rome, Italy",
  "startDate": "2024-05-01",
  "endDate": "2024-05-15",
  "highlights": ["Eiffel Tower", "Swiss Alps", "Colosseum"],
  "budget": "moderate",
  "transportation": ["train", "bus"]
}

Response: { journey }
```

#### Update Journey
```
PUT /api/journeys/:id
Authorization: Bearer <token>
Content-Type: application/json

{ ...updateData }

Response: { journey }
```

#### Delete Journey
```
DELETE /api/journeys/:id
Authorization: Bearer <token>

Response: { message }
```

#### Get My Journeys
```
GET /api/journeys/my-journeys
Authorization: Bearer <token>

Response: { count, journeys }
```

### Chat Routes (`/api/chats`)

#### Create/Start Chat
```
POST /api/chats
Authorization: Bearer <token>
Content-Type: application/json

{
  "participantId": "user_id",
  "journeyId": "journey_id" (optional)
}

Response: { chat }
```

#### Get All Chats
```
GET /api/chats
Authorization: Bearer <token>

Response: { count, chats }
```

#### Get Chat Details
```
GET /api/chats/:id
Authorization: Bearer <token>

Response: { chat }
```

#### Send Message
```
POST /api/chats/:id/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great journey! Have any tips?"
}

Response: { message }
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Token is valid for 30 days after login/registration.

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Database Connection

The app automatically connects to MongoDB on startup. If connection fails:

1. Check MONGODB_URI in .env
2. Verify MongoDB Atlas credentials
3. Ensure IP is whitelisted in MongoDB Atlas
4. Check network connectivity

## Development Tips

1. **Use Postman** to test API endpoints
2. **Check logs** in terminal for debugging
3. **Restart server** after changing .env
4. **Reset database** by dropping the collection in MongoDB Atlas

## Debugging

Enable detailed logs:
```bash
DEBUG=* npm run dev
```

## Production Deployment

For production, set:
```env
NODE_ENV=production
```

Ensure:
- JWT_SECRET is a long, random string
- MONGODB_URI uses production database
- FRONTEND_URL points to production domain
- Use HTTPS URLs

## Performance Optimization

- Indexes are created automatically on MongoDB
- Pagination can be added to GET endpoints
- Caching can be implemented with Redis
- Rate limiting can be added with express-rate-limit

## Support

For issues or questions, check the main README.md in the root directory.
