## BookWorm

Full-stack book sharing app with a Node/Express + MongoDB backend and an Expo (React Native) mobile client. Users can sign up, log in, and create book posts with an image and rating. Auth is JWT-based; images are stored on Cloudinary.

### Monorepo layout

```
Backend/   # Express API (JWT auth, MongoDB via Mongoose, Cloudinary uploads)
mobile/    # Expo app (React Native, Expo Router, Zustand, AsyncStorage)
```

### Features

- **Authentication**: Register and log in with JWT tokens
- **Books feed**: Paginated feed of all users' books
- **My books**: View books created by the logged-in user
- **Create/Delete**: Add a new book post (image + rating), delete your own posts
- **Image uploads**: Cloudinary storage

### Tech stack

- **Backend**: Node.js, Express 5, Mongoose (MongoDB), JWT, Cloudinary, CORS, Cron
- **Mobile**: Expo (React Native), Expo Router, AsyncStorage, Zustand, expo-image, expo-image-picker


## Getting started

### Prerequisites

- Node.js 18+ (LTS recommended)
- A MongoDB connection string (MongoDB Atlas or local)
- Cloudinary account (cloud name, API key, API secret)
- Expo tooling for the mobile app (Expo Go app on your device or Android/iOS emulators)

### 1) Backend setup

1. Install dependencies
   ```bash
   cd Backend
   npm install
   ```

2. Create a `.env` file in `Backend/`:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_long_random_secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Optional: used by the cron job to keep your deployed server warm
   # Should be a URL that returns 200 to a GET request (e.g., a custom health endpoint)
   API_URL=https://your-deployed-backend/health
   ```

3. Start the backend (development)
   ```bash
   npm run dev
   ```
   The API will start at `http://localhost:3000` by default.

### 2) Mobile app setup

1. Install dependencies
   ```bash
   cd mobile
   npm install
   ```

2. Point the app to your API by editing `mobile/constants/api.js`.

   Examples:
   - Android emulator: `http://10.0.2.2:3000/api`
   - iOS simulator: `http://127.0.0.1:3000/api`
   - Physical device (Expo Go): `http://<your-computer-LAN-IP>:3000/api`

   ```js
   // mobile/constants/api.js
   export const API_URL = "http://10.0.2.2:3000/api";
   ```

3. Start the app
   ```bash
   npm run start
   # or
   npm run android
   npm run ios
   npm run web
   ```


## API reference

Base URL: `http://localhost:3000/api`

### Auth

- POST `/auth/register`
  - Body: `{ username, email, password }`
  - Response: `{ token, user }`

- POST `/auth/login`
  - Body: `{ email, password }`
  - Response: `{ token, user }`

### Books (requires Authorization: `Bearer <token>`) 

- POST `/books`
  - Body: `{ title, caption, rating, image }`
  - `image` should be a data URL or file URI that Cloudinary can consume (the app uses expo-image-picker)
  - Response: `Book`

- GET `/books`
  - Query: `page` (default 1), `limit` (default 5)
  - Response: `{ books, currentPage, totalBooks, totalPages }`

- GET `/books/user`
  - Response: `Book[]` for the logged-in user

- DELETE `/books/:id`
  - Deletes the specified book if owned by the requester; also removes the image from Cloudinary when possible


## Data models (simplified)

### User
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "string (hashed)",
  "profileImage": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Book
```json
{
  "_id": "ObjectId",
  "title": "string",
  "caption": "string",
  "image": "string (Cloudinary URL)",
  "rating": 1,
  "user": "ObjectId (ref User)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```


## Environment notes

- CORS is enabled on the server.
- Protected routes require `Authorization: Bearer <token>`.
- The cron job in `Backend/src/lib/cron.js` can ping `API_URL` every ~14 minutes. If you want a "200 OK" for this ping, create a simple health route (e.g., `GET /health`) and set `API_URL` to that endpoint in production.


## Useful scripts

- Backend
  - `npm run dev` — start API with nodemon

- Mobile
  - `npm run start` — start Expo dev server
  - `npm run android` — open on Android
  - `npm run ios` — open on iOS
  - `npm run web` — open in web
  - `npm run test` — run Jest tests (if present)
  - `npm run lint` — run linter


## Troubleshooting

- **Device cannot reach backend**: Use the correct base URL for your environment. For phones on the same Wi‑Fi, use your computer's LAN IP (e.g., `http://192.168.x.x:3000/api`).
- **MongoDB connection errors**: Verify `MONGO_URI` and network access (IP allowlist if using Atlas).
- **Cloudinary errors**: Ensure all Cloudinary env vars are set and valid; confirm your account allows uploads.
- **Authorization errors**: Ensure the `Authorization` header is set to `Bearer <token>` after login/registration.





