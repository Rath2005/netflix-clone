# Netflix Clone API Documentation

This document provides a comprehensive guide to all REST API endpoints available in the Netflix Clone backend.

## Base URL
All API requests should be sent to:
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JSON Web Token (JWT) to be passed in the HTTP `Authorization` header.
```http
Authorization: Bearer <your_jwt_token>
```
If a request is made to a protected endpoint without a valid token, the server will return a `401 Unauthorized` status.

---

## API Endpoints

### 1. Authentication

#### **Register User**
* **Endpoint:** `POST /auth/register`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
* **Response (251 Created):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```

#### **Login User**
* **Endpoint:** `POST /auth/login`
* **Auth Required:** No
* **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
  ```

#### **Get Current User (Me)**
* **Endpoint:** `GET /auth/me`
* **Auth Required:** Yes
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "profilePic": "avatar-red.png"
    }
  }
  ```

---

### 2. User Profile

#### **Get Profile**
* **Endpoint:** `GET /users/profile`
* **Auth Required:** Yes
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "profilePic": "avatar-red.png",
      "createdAt": "2026-06-15T04:45:00.000Z"
    }
  }
  ```

#### **Update Profile**
* **Endpoint:** `PUT /users/profile`
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "name": "Jane Smith",
    "profilePic": "avatar-blue.png"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user",
      "profilePic": "avatar-blue.png"
    }
  }
  ```

#### **Change Password**
* **Endpoint:** `PUT /users/change-password`
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "currentPassword": "Password123",
    "newPassword": "NewPassword456"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

#### **Delete Account**
* **Endpoint:** `DELETE /users/delete`
* **Auth Required:** Yes
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User account deleted successfully"
  }
  ```

---

### 3. Movies

#### **Get All Movies**
* **Endpoint:** `GET /movies`
* **Auth Required:** Yes
* **Query Params (optional):** `page`, `limit`, `sort`, `search`, `genre`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 12,
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 12,
      "pages": 2
    },
    "data": [
      {
        "_id": "60d0fe4f5311236168a109cb",
        "title": "Avengers: Endgame",
        "description": "After the devastating events of Avengers: Infinity War...",
        "genre": ["Action", "Sci-Fi"],
        "year": 2019,
        "rating": "PG-13",
        "duration": "3h 1m",
        "thumbnail": "images/avengers.jpg",
        "videoUrl": "https://www.youtube.com/embed/TcMBFSGVi1c",
        "isTrending": true,
        "isRecommended": true,
        "type": "movie"
      }
    ]
  }
  ```

#### **Get Single Movie**
* **Endpoint:** `GET /movies/:id`
* **Auth Required:** Yes
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Avengers: Endgame",
      "description": "After the devastating events of Avengers: Infinity War..."
    }
  }
  ```

#### **Get Trending Movies**
* **Endpoint:** `GET /movies/trending`
* **Auth Required:** Yes
* **Response (200 OK):**
  Returns array of movies with `isTrending: true`.

#### **Get Recommended Movies**
* **Endpoint:** `GET /movies/recommended`
* **Auth Required:** Yes
* **Response (200 OK):**
  Returns array of movies with `isRecommended: true`.

#### **Create Movie**
* **Endpoint:** `POST /movies`
* **Auth Required:** Yes (Admin Only)
* **Request Body:**
  ```json
  {
    "title": "New Movie",
    "description": "A thriller film",
    "genre": ["Thriller"],
    "year": 2026,
    "rating": "R",
    "duration": "1h 50m",
    "thumbnail": "images/default.jpg",
    "videoUrl": "https://www.youtube.com/embed/example",
    "isTrending": false,
    "isRecommended": true,
    "type": "movie"
  }
  ```
* **Response (251 Created):**
  Created movie object.

---

### 4. TV Shows

#### **Get All TV Shows**
* **Endpoint:** `GET /tvshows`
* **Auth Required:** Yes
* **Response (200 OK):**
  Returns list of all TV shows.

#### **Get Single TV Show**
* **Endpoint:** `GET /tvshows/:id`
* **Auth Required:** Yes
* **Response (200 OK):**
  Returns details of a specific TV show.

#### **Create TV Show**
* **Endpoint:** `POST /tvshows`
* **Auth Required:** Yes (Admin Only)
* **Request Body:**
  ```json
  {
    "title": "New Show",
    "description": "Sci-Fi drama series",
    "genre": ["Sci-Fi", "Drama"],
    "year": 2025,
    "rating": "TV-MA",
    "seasons": 1,
    "episodes": 10,
    "thumbnail": "images/default.jpg",
    "isTrending": true
  }
  ```
* **Response (251 Created):**
  Created TV show object.

---

### 5. Watchlist

#### **Get Watchlist**
* **Endpoint:** `GET /watchlist`
* **Auth Required:** Yes
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe4f5311236168a109cd",
      "user": "60d0fe4f5311236168a109ca",
      "movies": [
        {
          "_id": "60d0fe4f5311236168a109cb",
          "title": "Avengers: Endgame",
          "thumbnail": "images/avengers.jpg"
        }
      ],
      "tvshows": []
    }
  }
  ```

#### **Add to Watchlist**
* **Endpoint:** `POST /watchlist`
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "contentId": "60d0fe4f5311236168a109cb",
    "contentType": "movie" // or "tvshow"
  }
  ```
* **Response (200 OK):**
  Updated watchlist object.

#### **Remove from Watchlist**
* **Endpoint:** `DELETE /watchlist/:id`
* **Auth Required:** Yes
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Item removed from watchlist",
    "data": { ... }
  }
  ```

---

### 6. Recently Watched

#### **Get Recently Watched List**
* **Endpoint:** `GET /recently-watched`
* **Auth Required:** Yes
* **Response (200 OK):**
  Returns history array of movies/TV shows watched by user, sorted by access time.

#### **Add Recently Watched**
* **Endpoint:** `POST /recently-watched`
* **Auth Required:** Yes
* **Request Body:**
  ```json
  {
    "contentId": "60d0fe4f5311236168a109cb",
    "contentType": "movie"
  }
  ```

#### **Clear Watch History**
* **Endpoint:** `DELETE /recently-watched`
* **Auth Required:** Yes

---

### 7. Admin Operations

#### **Get All Users**
* **Endpoint:** `GET /admin/users`
* **Auth Required:** Yes (Admin Only)

#### **Promote User to Admin**
* **Endpoint:** `PUT /admin/users/:id/promote`
* **Auth Required:** Yes (Admin Only)

#### **Delete User**
* **Endpoint:** `DELETE /admin/users/:id`
* **Auth Required:** Yes (Admin Only)

---

## Axios Code Examples

### Global API Setup (`api.js`)
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to automatically add JWT header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
```

### Making a Login Request
```javascript
async function loginUser(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
  }
}
```
