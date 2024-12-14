# Windsurf Prompts Repository

A community-driven platform for sharing and discovering prompts specifically designed for Windsurf IDE's AI assistant. Enhance your development workflow with curated prompts for code review, testing, refactoring, and more.

![Windsurf Prompts](public/preview.png)

## Features

- 🎨 **Modern Design System**: Clean, themed interface with consistent colors and typography
- 🔍 **Category-based Navigation**: Browse prompts by categories for easy discovery
- 💻 **Development-Focused**: Prompts specifically designed for software development
- 🌟 **Community Curated**: High-quality prompts shared by the developer community
- 🔒 **Privacy Controls**: Choose to make your prompts public or private
- 📱 **Responsive Design**: Seamless experience across all devices
- 🔄 **Real-time Updates**: Instant updates using Firebase Realtime Database
- 👥 **Role-Based Access**: Admin dashboard for content moderation and user management
- 🔐 **Secure Authentication**: Multiple sign-in options with Firebase Auth

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Firebase account

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/windsurf-prompts.git
cd windsurf-prompts
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## Authentication

The application uses Firebase Authentication with multiple providers:

- Email/Password authentication
- Google Sign-In
- Role-based access control (User/Admin)

### User Roles

- **User**: Can create, edit, and delete their own prompts
- **Admin**: Additional access to:
  - User management
  - Content moderation
  - Category management
  - Analytics dashboard

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Firebase Auth with Google Sign-in
- **Database**: Firebase Realtime Database
- **Fonts**: Inter (text) & JetBrains Mono (code)
- **Icons**: Custom SVG icons
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Data Validation**: Zod

## Project Structure

```
prompt-repository/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable React components
│   ├── contexts/            # React contexts (Auth, Theme)
│   ├── lib/                 # Utility functions and Firebase setup
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles and Tailwind config
├── public/                 # Static assets
└── scripts/               # Utility scripts
```

## Design System

### Colors

```typescript
colors: {
  primary: {
    DEFAULT: '#0F172A',  // Deep blue-gray
    light: '#1E293B',
    dark: '#020617',
    accent: '#3B82F6'    // Bright blue
  },
  surface: {
    DEFAULT: '#1E293B',  // Darker background
    light: '#334155',
    dark: '#0F172A'
  },
  text: {
    DEFAULT: '#F8FAFC',  // Light text
    muted: '#94A3B8',
    accent: '#60A5FA'
  }
}
```

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

### Contribution Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication providers:
   - Email/Password
   - Google
3. Set up Realtime Database
4. Configure security rules
5. Add authorized domains for authentication

### Security Rules

```javascript
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "prompts": {
      ".read": true,
      ".write": "auth != null",
      "$promptId": {
        ".write": "auth != null && (data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin')"
      }
    }
  }
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@windsurf.dev or join our [Discord community](https://discord.gg/windsurf).
