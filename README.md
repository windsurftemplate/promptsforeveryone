# Prompts For Everyone

A modern web application for discovering, creating, and sharing AI prompts. Built with Next.js 13, Firebase Realtime Database, and Stripe integration.

## Features

### Core Features
- 🔐 Secure authentication with email and Google sign-in
- 🎯 Public and private prompt categories
- 💬 AI chat interface for paid users
- 📱 Responsive design with modern UI
- 🌙 Dark mode with cyan accents
- 🔍 Advanced search and filtering

### User Features
- Create and manage personal prompts
- Organize prompts in categories
- Vote on public prompts
- Access premium features with paid subscription

### Pro Features
- Private categories and subcategories
- AI chat interface
- Ad-free experience
- Priority support

## Tech Stack

### Frontend
- Next.js 13 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Heroicons

### Backend
- Firebase Realtime Database
- Firebase Authentication
- Firebase Admin SDK

### Payment Processing
- Stripe Integration
- Subscription Management

## Getting Started

### Prerequisites
- Node.js 16.x or later
- npm or yarn
- Firebase account
- Stripe account

### Environment Variables
Create a `.env.local` file with:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_PRICE_ID=your_price_id

# OpenAI (for Chat)
OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/promptsforeveryone.git
cd promptsforeveryone
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication:
   - Email/Password
   - Google Sign-in
3. Create a Realtime Database
4. Set up Firebase Admin SDK
5. Configure security rules:

```json
{
  "rules": {
    "prompts": {
      ".read": true,
      ".write": "auth != null"
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "votes": {
      "users": {
        "$uid": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid"
        }
      },
      "prompts": {
        ".read": true,
        ".write": "auth != null"
      }
    }
  }
}
```

### Stripe Setup

1. Create a Stripe account
2. Set up a subscription product
3. Configure webhook endpoints:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Add webhook secret and price ID to environment variables

## Project Structure

```
src/
├── app/                 # Next.js 13 app directory
│   ├── (auth)/         # Authentication pages
│   ├── api/            # API routes
│   ├── chat/           # Chat interface
│   ├── dashboard/      # User dashboard
│   ├── explore/        # Public prompts
│   └── prompt/         # Individual prompt pages
├── components/         # React components
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout components
│   └── ui/            # Reusable UI components
├── contexts/          # React contexts
├── lib/              # Utility functions
└── styles/           # Global styles
```

## Development

### Code Style
- ESLint for linting
- Prettier for formatting
- TypeScript for type safety

### Best Practices
- Use TypeScript for all new files
- Follow component-based architecture
- Implement proper error handling
- Write meaningful commit messages

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
vercel deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@promptsforeveryone.com
