# Windsurf Prompts Repository

A community-driven platform for sharing and discovering prompts specifically designed for Windsurf IDE's AI assistant. Enhance your development workflow with curated prompts for code review, testing, refactoring, and more.

![Windsurf Prompts](public/preview.png)

## Features

- 🎨 **Modern Design System**: Clean, dark-themed interface optimized for developers
- 🔍 **Smart Search**: Find the perfect prompt for your development task
- 💻 **Development-Focused**: Prompts specifically designed for software development
- 🌟 **Community Curated**: High-quality prompts vetted by the developer community
- 🔄 **Real-time Updates**: Instant feedback on prompt effectiveness
- 📱 **Responsive Design**: Seamless experience across all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database
- **Fonts**: Inter (text) & JetBrains Mono (code)
- **Icons**: Custom SVG icons

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

### Typography

- **Body**: Inter font for clean, modern text
- **Code**: JetBrains Mono for code snippets
- **Scale**: Follows Tailwind's default type scale

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git

### Installation

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

3. Create a `.env.local` file in the root directory and add necessary environment variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

### Environment Setup

1. Create a `.env.local` file in the root directory with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Seeding the Database

To populate the database with sample prompts:

1. Ensure your Firebase Realtime Database is set up and the database URL is correctly configured in `.env.local`
2. Run the seeding script:
```bash
npx ts-node scripts/seedPrompts.ts
```

## Firebase Setup

### Database Rules

The project uses Firebase Realtime Database with secure rules that:
- Allow public read access to prompts
- Restrict write access to authenticated users
- Ensure users can only modify their own prompts
- Validate data structure and field types

To deploy the database rules:

1. Install Firebase CLI if not already installed:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Deploy the rules:
```bash
firebase deploy --only database
```

The rules file is located at `firebase/database.rules.json`. Review and modify the rules as needed for your use case.

### Seeding Data

To populate the database with sample prompts:

1. Temporarily update the database rules to allow write access for seeding:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

2. Run the seeding script:
```bash
npx ts-node scripts/seedPrompts.ts
```

3. After seeding, deploy the secure rules:
```bash
firebase deploy --only database
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         
│   ├── ui/             # Reusable UI components
│   └── layout/         # Layout components
├── contexts/           # React contexts
├── lib/                # Utility functions
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Windsurf IDE team for inspiration
- All contributors who share their prompts
- Next.js and Tailwind CSS communities
