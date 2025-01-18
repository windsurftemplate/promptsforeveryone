# Prompts For Everyone

A modern web platform for sharing, discovering, and managing AI prompts. Built with Next.js, Firebase, and Tailwind CSS.

## 🌟 Features

### For Users
- **Browse Prompts**: Explore a vast collection of AI prompts organized by categories and subcategories
- **Submit Prompts**: Share your own prompts with the community
- **Personal Dashboard**: Manage your submitted prompts and track your contributions
- **User Profiles**: Customize your profile and view other users' contributions
- **Prompt Management**: Create, edit, and delete your prompts
- **Categories**: Browse prompts by categories and subcategories
- **Copy to Clipboard**: Easily copy prompts with a single click
- **Responsive Design**: Seamless experience across all devices

### For Administrators
- **Admin Dashboard**: Comprehensive tools for site management
- **User Management**: Monitor and manage user accounts
- **Category Management**: Create, edit, and organize categories and subcategories
- **Content Moderation**: Review and moderate submitted prompts
- **Blog Management**: Create and manage blog posts
- **Analytics**: Track site usage and user engagement

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

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

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

- **Frontend**:
  - Next.js 15.0.0 (App Router)
  - React 18
  - Tailwind CSS 3.4
  - TypeScript 5.2

- **Backend**:
  - Firebase Realtime Database
  - Firebase Authentication
  - Firebase Storage

- **State Management**:
  - React Context API
  - Custom Hooks

- **UI Components**:
  - Headless UI
  - Hero Icons
  - Custom Components

## 📁 Project Structure

```
promptsforeveryone/
├── app/                    # Next.js 13 app directory
│   ├── admin/             # Admin dashboard pages
│   ├── dashboard/         # User dashboard pages
│   ├── explore/          # Prompt exploration pages
│   ├── submit/           # Prompt submission page
│   └── ...
├── components/            # Reusable React components
├── contexts/             # React Context providers
├── lib/                  # Utility functions and Firebase setup
├── public/              # Static assets
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## 🔒 Security

- Firebase Authentication for user management
- Role-based access control (RBAC)
- Secure data validation rules
- Protected API routes with origin validation
- Environment variable protection
- Rate limiting and request validation

## 🔌 API Overview

Our API is designed with security in mind and follows REST principles. We provide both public and private endpoints.

### Public Endpoints
These endpoints are publicly accessible and can be used without authentication:

- **Categories**
  - `GET /api/categories` - Browse all categories
  - Response: JSON object with categories data
  - Cache: 60 seconds with stale-while-revalidate

- **Prompts**
  - `GET /api/prompts` - Browse public prompts
  - `GET /api/prompts/count` - Get total public prompts count
  - Response: JSON with prompts or count data
  - Cache: 60 seconds with stale-while-revalidate

- **Open Graph**
  - `GET /api/og` - Generate social media preview images
  - Response: Dynamic OG image

- **Contact**
  - `POST /api/contact` - Submit contact form
  - `POST /api/careers` - Submit career applications

### Private Endpoints
Protected endpoints require authentication and proper authorization. Documentation for these endpoints is available internally for developers and approved partners.

### Security Features
- Authentication required for private endpoints
- Rate limiting and DDoS protection
- Input validation and sanitization
- CORS protection
- Comprehensive error handling
- Edge runtime optimization

### Access
For complete API documentation:
- Internal developers: Refer to `docs/API.md`
- Partners: Contact our developer relations team
- Enterprise customers: Refer to your service agreement

## 🎨 Design System

- Consistent color scheme with cyan (#00ffff) accents
- Dark mode optimized
- Responsive grid layouts
- Modern glassmorphism effects
- Smooth transitions and animations

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Project Lead: [Your Name]
- Frontend Developer: [Name]
- Backend Developer: [Name]
- UI/UX Designer: [Name]

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)
- [Hero Icons](https://heroicons.com/)

## 📞 Support

For support, email support@promptsforeveryone.com or join our Discord community.
