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

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Firebase Auth with Google Sign-in
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
- Firebase account

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

3. Create a `.env.local` file in the root directory and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication with Google provider
   - Create a Realtime Database
   - Set up database rules for public/private access

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── category/          # Dynamic category pages
│   ├── explore/           # Browse all prompts
│   ├── submit/            # Submit new prompts
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
└── types/                 # TypeScript type definitions
```

## Features in Detail

### Authentication
- Sign in with Google
- Protected routes for authenticated users
- User profile management

### Prompt Management
- Create and edit prompts
- Set visibility (public/private)
- Categorize prompts
- Add tags for better discovery

### Browse and Discovery
- Browse prompts by category
- Filter prompts by tags
- Search functionality
- Real-time updates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
