# Authentication Feature

## Purpose
Handles user authentication including login, signup, and dashboard navigation.

## Pages
- `pages/LoginPage.jsx` - User login form
- `pages/SignupPage.jsx` - User registration form
- `pages/BestMethodPage.jsx` - Static page explaining the project methodology

## Components
- `components/DashboardCard.jsx` - Navigation card for dashboard

## Services
- `authApi` - API service for authentication operations

## State
- Uses AuthContext for global authentication state
- Local form state for login/signup

## Data Flow
1. User enters credentials
2. Calls authApi to authenticate
3. Updates AuthContext on success
4. Redirects to dashboard

## Dependencies
- React Router for navigation
- AuthContext for global auth state
- Shared authApi service

## How to Extend
- Add social login providers
- Add password reset flow
- Add email verification
