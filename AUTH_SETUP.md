# Authentication System Setup Guide

## Overview
A complete authentication system has been implemented for the Ecommerce Analytics Dashboard with the following features:

- Login page with email/password authentication
- Session persistence using localStorage
- Protected routes that redirect to login when not authenticated
- Logout functionality with automatic redirect
- Auth context for managing user state across the app
- Mock API endpoint for login that validates credentials

## Project Structure

### New Files Created

#### 1. **Auth Context** (`/context/auth-context.tsx`)
Provides React Context for authentication state management:
- `AuthProvider`: Wraps the entire app to provide auth context
- `useAuth()`: Hook to access auth state and methods from any component
- Manages user data, authentication token, and loading states
- Persists user session to localStorage

**Functions:**
- `login(email, password)`: Calls API endpoint and stores user session
- `logout()`: Clears user session from state and localStorage

#### 2. **Login Page** (`/app/login/page.tsx`)
Beautiful login interface with:
- Email input field with demo credentials hint
- Password field with show/hide toggle
- Error handling with alert messages
- Loading state during login
- Auto-redirect to dashboard if already logged in
- Demo credentials displayed for easy testing

**Demo Credentials:**
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

#### 3. **Login API** (`/app/api/auth/login/route.ts`)
Mock API endpoint that:
- Validates email and password
- Returns user data and auth token
- Implements simple credential checking (for demo purposes)
- Returns appropriate error messages

#### 4. **Protected Routes** (`/components/protected-route.tsx`)
Higher-order component that:
- Wraps dashboard routes to enforce authentication
- Redirects unauthenticated users to login
- Shows loading state while checking auth status
- Prevents flash of content before redirect

#### 5. **Updated Layout** (`/app/layout.tsx`)
- Imports and wraps app with `AuthProvider`
- Makes auth context available to all child components

#### 6. **Updated Dashboard Layout** (`/app/(dashboard)/layout.tsx`)
- Wraps dashboard with `ProtectedRoute`
- Ensures only authenticated users can access dashboard

#### 7. **Updated Header** (`/components/dashboard/header.tsx`)
- Displays logged-in user name and email
- Logout button in dropdown menu
- Redirects to login page after logout

## How It Works

### 1. App Initialization
```
User visits app
  → AuthProvider checks localStorage for existing user session
  → If session exists, user is logged in
  → If no session, user sees login page
```

### 2. Login Flow
```
User fills login form
  → Clicks "Sign In"
  → API call to /api/auth/login
  → Server validates credentials
  → Returns user data + token
  → Context stores user in localStorage
  → Redirect to dashboard
```

### 3. Protected Route Access
```
User tries to access /products (or any dashboard route)
  → ProtectedRoute component checks if user is authenticated
  → If authenticated: Show dashboard content
  → If not authenticated: Redirect to /login
```

### 4. Logout Flow
```
User clicks "Log out" in header dropdown
  → logout() called
  → Clears user from localStorage
  → Redirects to /login
```

### 5. Session Persistence
```
User logs in successfully
  → User data saved to localStorage
  → Page refresh
  → AuthProvider checks localStorage on mount
  → User remains logged in
```

## API Endpoint Reference

### POST `/api/auth/login`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "id": "1",
  "email": "admin@example.com",
  "name": "Admin User",
  "token": "YWRtaW5AZXhhbXBsZS5jb206MTc3NzAxODM2MDI0OA=="
}
```

**Error Response (400/401):**
```json
{
  "error": "Invalid email or password"
}
```

## Available Routes

### Public Routes
- `/login` - Login page (redirects to dashboard if already logged in)

### Protected Routes (require authentication)
- `/` - Dashboard
- `/sales` - Sales page
- `/products` - Products management
- `/customers` - Customers page
- `/orders` - Orders page
- `/reports` - Reports page
- `/profile` - User profile

## Using the useAuth Hook

In any client component, you can access auth state:

```tsx
"use client"
import { useAuth } from "@/context/auth-context"

export function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  if (!isAuthenticated) {
    return <div>Please log in</div>
  }
  
  return <div>Welcome {user?.name}!</div>
}
```

## Testing the Authentication System

### 1. Test Login
- Navigate to http://localhost:3000/login
- Enter admin@example.com and admin123
- Click "Sign In"
- Should be redirected to dashboard

### 2. Test Session Persistence
- After logging in, refresh the page
- User should still be logged in (session persists)

### 3. Test Protected Routes
- Open browser DevTools
- Clear localStorage
- Try to access http://localhost:3000/products
- Should be redirected to login page

### 4. Test Logout
- While logged in, click your profile avatar
- Click "Log out"
- Should be redirected to login page
- localStorage should be cleared

## Modifying for Production

To use this authentication system in production:

1. **Update the Login API** (`/app/api/auth/login/route.ts`):
   - Connect to a real database
   - Hash passwords using bcrypt or similar
   - Implement JWT token generation
   - Add rate limiting

2. **Update Auth Context** (`/context/auth-context.tsx`):
   - Update the login API endpoint URL
   - Handle different error types
   - Add refresh token logic if needed

3. **Add More Security**:
   - Use HTTP-only cookies for tokens
   - Add CSRF protection
   - Implement token expiration
   - Add request signing for API calls

4. **Environment Variables**:
   - Store API URLs in environment variables
   - Move demo credentials out of the code

## Security Notes

⚠️ **Current Implementation:**
- This is a demo/development implementation
- Passwords are stored in plain text (demo only)
- Tokens are stored in localStorage (vulnerable to XSS)
- No HTTPS enforcement
- No rate limiting

✅ **Recommended for Production:**
- Use HTTPS only
- Hash passwords with bcrypt
- Store tokens in HTTP-only cookies
- Implement JWT with expiration
- Add rate limiting on login attempts
- Add CSRF protection
- Use environment variables for configuration
- Implement refresh token rotation
