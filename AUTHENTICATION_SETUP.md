# Authentication Setup Guide

## ✅ What's Been Set Up

### Backend (Laravel)
- ✅ `AuthController` with login, register, logout, and user endpoints
- ✅ API routes configured at `/api/login`, `/api/register`, `/api/logout`, `/api/user`
- ✅ Sanctum authentication configured
- ✅ User model updated with `HasApiTokens` trait

### Frontend (React)
- ✅ `AuthContext` - Global authentication state management
- ✅ `Login` component - Login form
- ✅ `Register` component - Registration form
- ✅ `ProtectedRoute` component - Route protection wrapper
- ✅ Updated `apiHelpers.js` with authentication functions

## 🚀 How to Use

### 1. Wrap Your App with AuthProvider

In your `main.jsx` or `App.jsx`:

```jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app content */}
    </AuthProvider>
  );
}
```

### 2. Use Authentication in Components

```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Hello, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### 3. Protect Routes

```jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';

<Routes>
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
</Routes>
```

### 4. Use Login/Register Components

```jsx
import Login from './components/Login';
import Register from './components/Register';

<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Routes>
```

## 📝 API Endpoints

### Register
- **POST** `/api/register`
- Body: `{ name, email, password, password_confirmation }`

### Login
- **POST** `/api/login`
- Body: `{ email, password, remember? }`

### Logout
- **POST** `/api/logout`
- Requires: Authentication

### Get Current User
- **GET** `/api/user`
- Requires: Authentication
- Returns: `{ user: {...} }`

## 🔧 Example Integration

See `src/App.example.jsx` for a complete example of how to integrate everything.

## 🎯 Next Steps

1. Copy `App.example.jsx` to `App.jsx` (or integrate into your existing App)
2. Make sure you have React Router installed: `npm install react-router-dom`
3. Test the authentication flow:
   - Register a new user
   - Login
   - Access protected routes
   - Logout

## 🐛 Troubleshooting

- **CORS errors**: Make sure backend is running and CORS is configured
- **401 errors**: Check that CSRF cookie is being set (handled automatically)
- **User not persisting**: Check browser cookies are enabled
