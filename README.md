# Prompts For Everyone

A modern web platform for managing, sharing, and discovering AI prompts. Built with Next.js, Firebase, and Tailwind CSS.

![Prompts For Everyone](.github/preview.png)

## Features

### 🚀 Core Features

- **AI-Powered Prompts**: Access a curated collection of high-quality prompts optimized for various AI models
- **Smart Categories**: Organize prompts with intelligent categorization
- **Interactive Chat**: Test and refine prompts in real-time
- **Private Collections**: Create and manage private prompt collections
- **Version Control**: Track prompt iterations and improvements
- **Cloud Sync**: Access your prompts from anywhere

### 💡 Technical Features

- Modern, responsive UI with glassmorphism design
- Real-time database with Firebase
- Authentication with multiple providers (Email, Google)
- Server-side rendering with Next.js 13
- Type-safe development with TypeScript
- Smooth animations with Framer Motion
- Styling with Tailwind CSS

## Tech Stack

### Frontend
- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript 5.0+
- **State Management**: React Context API
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - CSS Modules for component-specific styles
  - Framer Motion for animations
- **UI Components**:
  - Custom components with Tailwind CSS
  - Heroicons for icons
  - Custom animations and transitions

### Backend & Database
- **Platform**: Firebase
  - Realtime Database for real-time data sync
  - Authentication for user management
  - Cloud Functions for serverless operations
- **API**: RESTful endpoints with Next.js API routes
- **Data Storage**: Firebase Realtime Database with JSON structure

### Development & Build Tools
- **Package Manager**: npm/yarn
- **Build Tool**: Next.js built-in compiler
- **Code Quality**:
  - ESLint for code linting
  - Prettier for code formatting
  - TypeScript for static type checking
- **Version Control**: Git & GitHub

### Testing & Quality Assurance
- **Unit Testing**: Jest
- **Component Testing**: React Testing Library
- **E2E Testing**: Cypress
- **Type Safety**: TypeScript strict mode

### Deployment & Infrastructure
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Firebase Analytics
- **Performance**: 
  - Next.js automatic optimization
  - Image optimization
  - Code splitting
  - Dynamic imports

### Security
- **Authentication**: Firebase Auth
- **Authorization**: Custom middleware
- **Data Protection**: Firebase Security Rules
- **Environment Variables**: Vercel/Local ENV

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- Firebase account

### Environment Setup

1. Create a `.env.local` file in the root directory with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
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

## Project Structure

```
promptsforeveryone/
├── app/                    # Next.js 13 app directory
│   ├── dashboard/         # Dashboard page
│   ├── explore/          # Explore prompts page
│   ├── features/         # Features showcase page
│   └── submit/           # Submit prompt page
├── src/
│   ├── components/       # Reusable components
│   ├── contexts/         # React contexts
│   ├── lib/             # Utility functions and configurations
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── styles/             # Global styles
```

## Key Components

### Authentication

- Email/Password authentication
- Google sign-in
- Protected routes
- User session management

### Database Structure

```
/prompts
  ├── [promptId]
  │   ├── title
  │   ├── description
  │   ├── content
  │   ├── categoryId
  │   ├── userId
  │   ├── tags
  │   └── createdAt
  
/users
  ├── [userId]
  │   └── prompts
  │       └── [promptId]

/categories
  └── [categoryId]
      └── name
```

### Features Implementation

1. **Dashboard**
   - View personal prompts
   - Filter by categories
   - Quick actions (edit, delete, copy)

2. **Explore Page**
   - Browse public prompts
   - Category-based filtering
   - Search functionality

3. **Submit Page**
   - Create new prompts
   - Category selection
   - Tag management

## Styling

The application uses a consistent design system:
- Primary color: `#00ffff` (Cyan)
- Dark theme with glassmorphism effects
- Responsive design for all screen sizes
- Smooth transitions and animations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Firebase team for the backend infrastructure
- Tailwind CSS team for the utility-first CSS framework
- All contributors and users of the platform
