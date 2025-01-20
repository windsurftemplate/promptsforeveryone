# Prompts For Everyone

A modern web platform for sharing and managing AI prompts with a focus on categories, user management, and a seamless user experience.

## Features

### User Management
- Authentication with email/password
- User roles (admin, paid user, free user)
- Subscription management with Stripe
- User dashboard for managing prompts and settings

### Prompt Management
- Public and private prompts
- Category and subcategory organization
- Prompt voting system
- Prompt sharing functionality
- Copy to clipboard feature

### Admin Features
- User management (change roles, plans)
- Category/subcategory management
- Prompt moderation
- Ad management
- Analytics dashboard

### Premium Features
- Ad-free experience
- Private prompts
- Access to premium categories
- AI Prompt Coach
- Prompt Generator

## UI Components

### PromptCard
The PromptCard component is a key UI element used throughout the application for displaying prompts. It features:
- Fixed height of 180px for consistent layout
- Responsive design with hover effects
- Title truncation for long titles
- Description with 2-line clamp
- Tag display with custom styling
- Social sharing buttons (Twitter, Facebook, LinkedIn, WhatsApp)
- Copy to clipboard functionality
- Delete option for prompt creators
- Consistent styling:
  ```css
  - Background: black/30 opacity
  - Border: cyan with 20% opacity
  - Hover: cyan border with 50% opacity
  - Rounded corners
  - Padding: 1.5rem (p-6)
  ```

### Navigation
- Desktop and mobile-responsive navigation
- Dropdown menus for Product and Resources
- Dynamic menu items based on user role
- Smooth hover transitions
- Authentication state management

### Ad Display
- Banner ads at the top of pages
- Inline ads every 5 prompts
- Ad-free experience for paid users
- Responsive ad sizing matching content
- Microsoft Clarity integration for analytics

### Dashboard Layout
- Grid layout for prompts
- Consistent card sizing
- Infinite scroll loading
- Category filtering
- Toggle between list and grid views

### Theme
- Dark theme with cyan accents
- Consistent color scheme:
  - Primary: #00ffff (cyan)
  - Text: white with varying opacity
  - Backgrounds: black with transparency
  - Hover states: cyan with different opacities

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Prompts
- `GET /api/prompts` - List prompts (with filters)
  - Query params:
    - `categoryId`: Filter by category
    - `subcategoryId`: Filter by subcategory
    - `isAdmin`: Show all prompts for admin
- `GET /api/prompts/[id]` - Get specific prompt
- `POST /api/prompts` - Create new prompt
- `PUT /api/prompts/[id]` - Update prompt
- `DELETE /api/prompts/[id]` - Delete prompt
- `POST /api/prompts/[id]/like` - Toggle prompt like

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/[id]` - Get category details
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/[id]` - Update category (admin)
- `DELETE /api/categories/[id]` - Delete category (admin)

### Subcategories
- `POST /api/categories/[id]/subcategories` - Create subcategory
- `PUT /api/categories/[id]/subcategories/[subId]` - Update subcategory
- `DELETE /api/categories/[id]/subcategories/[subId]` - Delete subcategory

### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `PUT /api/users/[id]/role` - Update user role (admin)
- `PUT /api/users/[id]/plan` - Update user plan (admin)

### Subscription
- `POST /api/subscription/create` - Create subscription
- `POST /api/subscription/cancel` - Cancel subscription
- `GET /api/subscription/status` - Get subscription status

## Important Implementation Details

### Authentication Flow
1. User signs up/logs in through Firebase Auth
2. JWT token is generated and stored
3. Token is validated on protected routes
4. User data is fetched from Firebase Realtime Database

### Permission Levels
- **Admin**: Full access to all features
- **Paid Users**: 
  - Access to all public content
  - Can create private prompts
  - Ad-free experience
  - Access to premium features
- **Free Users**:
  - Access to public content
  - Basic prompt creation
  - See advertisements

### Database Structure (Firebase)
```
/users
  /{userId}
    - email
    - role
    - plan
    - createdAt
    - lastLogin
    - prompts/
      /{promptId}
        - title
        - content
        - isPrivate
        - categoryId
        - subcategoryId

/prompts
  /{promptId}
    - title
    - content
    - userId
    - categoryId
    - subcategoryId
    - visibility
    - createdAt
    - votes/
      /{userId}: true

/categories
  /{categoryId}
    - name
    - count
    - subcategories/
      /{subcategoryId}
        - name
```

### Ad Management
- Ads are hidden for paid users and admins
- Two types of ads: banner and inline
- Ads can be managed through admin dashboard
- Ad visibility is controlled by user's plan status

### Security Measures
1. Origin validation for API endpoints
2. Rate limiting on authentication endpoints
3. Data validation for all inputs
4. Proper error handling and logging
5. Secure Firebase rules implementation

### Performance Optimizations
1. Edge runtime for API routes
2. Caching strategies:
   - Public prompts: 60s cache with revalidation
   - Categories: 5min cache
   - User data: No cache
3. Lazy loading for images and components
4. Optimized database queries
5. Efficient pagination implementation

## Environment Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_DB_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Build for production: `npm run build`

## Deployment
- Deployed on Vercel
- Automatic deployments on main branch
- Environment variables configured in Vercel dashboard
- Domain configuration with SSL
- Edge functions enabled
