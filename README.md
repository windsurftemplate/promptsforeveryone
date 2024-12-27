# Prompt Repository

A modern web application for managing and sharing AI prompts, built with Next.js 13, Firebase, and Stripe integration.

## Features

### User Management
- Email and Google authentication
- User profiles with customizable display names and social links
- Subscription management (Free and Pro tiers)

### Prompt Management
- Create, read, update, and delete prompts
- Public and private prompt visibility
- Category-based organization
- Rich text editor for prompt content
- Search and filter functionality

### Categories
- Public categories for all users
- Private categories for Pro users
- Drag-and-drop category reordering
- Subcategory support
- Category management in admin panel

### Dashboard
- Personal prompt library
- Category-based filtering
- Grid layout with uniform card sizes
- Modal-based prompt editing
- Quick actions for prompt management

### Explore Page
- Browse public prompts
- Category-based navigation
- Grid layout for easy browsing
- Search functionality

### Pro Features
- Private categories
- Advanced prompt management
- Priority support
- Ad-free experience

### Admin Panel
- User management
- Category CRUD operations
- Prompt moderation
- Analytics dashboard

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Payment**: Stripe integration
- **State Management**: React Context
- **UI Components**: Custom components with Tailwind CSS
- **Authentication**: Firebase Auth with multiple providers

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Firebase account
- Stripe account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PRICE_ID=your_stripe_price_id
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/prompt-repository.git
cd prompt-repository
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with Email/Password and Google providers
3. Create a Firestore database
4. Set up Firebase security rules
5. Configure Firebase hosting (optional)

### Stripe Setup

1. Create a Stripe account
2. Set up a subscription product
3. Configure webhook endpoints
4. Add price ID to environment variables

## Project Structure

```
src/
├── app/                    # Next.js 13 app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── category/          # Category pages
│   ├── dashboard/         # User dashboard
│   ├── explore/          # Public explore page
│   ├── settings/         # User settings
│   ├── signin/           # Authentication pages
│   └── signup/           # User registration
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── contexts/             # React contexts
├── lib/                  # Utility functions
└── styles/              # Global styles
```

## Development

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

### Testing

- Jest for unit testing
- React Testing Library for component testing
- Cypress for end-to-end testing

### Deployment

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Deploy to hosting platform of choice (Vercel recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@promptrepository.com or join our Discord community.

## Acknowledgments

- Next.js team for the amazing framework
- Firebase team for the backend infrastructure
- Stripe team for payment processing
- All contributors and users of the platform
