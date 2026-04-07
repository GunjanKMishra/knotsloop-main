# Knotloop

From Videos to Learning. Knot Your Content into Loops That Teach Better.

## Project Overview

Knotloop is a modern Next.js application that helps creators transform video content into structured learning loops and playlists. Built with a standard Next.js 15 project structure using TypeScript, React 19, Tailwind CSS, and mock JSON data.

## Tech Stack

- **Framework**: Next.js 15.5+ with App Router
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4 + PostCSS
- **UI Components**: Radix UI + shadcn/ui patterns
- **Icons**: Lucide React
- **Data**: Mock JSON with localStorage persistence
- **Package Manager**: npm/pnpm

## Project Structure

```
knotloop/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with metadata
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── signup/           # Signup flow components
│   │   ├── CreatorDashboard.tsx
│   │   ├── LoopsPage.tsx
│   │   ├── WaitlistModal.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── mockData.ts       # Mock data service with CRUD operations
│   │   ├── supabase.ts       # Stub for backward compatibility
│   │   └── utils.ts          # Utility functions
│   └── styles/               # Global styles
├── public/                   # Static assets
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GunjanKMishra/knotloop-main.git
cd knotloop-main
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Features

- **Creator Dashboard**: Manage loops and playlists
- **Video Loops**: Organize videos into structured learning paths
- **Signup Flow**: Multi-step onboarding for creators
- **Waitlist**: Collect early adopter signups
- **Mock Data System**: In-memory data with localStorage persistence

## Data Persistence

The application uses a mock data system with localStorage persistence:

- **No Backend Required**: All data is stored in the browser
- **CRUD Operations**: Create, read, update, delete operations available
- **Persistent State**: Data survives page reloads via localStorage
- **Mock Data Service**: Located in `src/lib/mockData.ts`

### Mock Data Categories
- Disciplines and learning paths
- Loops (learning collections)
- Videos and playlists
- User profiles and authentication
- Waitlist signups

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Development Guidelines

### Component Structure
- Keep components in `src/components/`
- Use functional components with hooks
- Follow React best practices
- Split large components into smaller pieces

### Styling
- Use Tailwind CSS classes
- Follow the design system in `tailwind.config.js`
- Create reusable component styles in `src/components/ui/`

### Type Safety
- Use TypeScript for all files
- Define interfaces for data models
- Avoid using `any` type

### State Management
- Use React hooks (useState, useContext)
- Use mock data service for data persistence
- Keep state as local as possible

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy with zero configuration

```bash
# Vercel automatic deployment
git push origin main
```

### Other Platforms
```bash
# Build for production
npm run build

# Start production server
npm start
```

## File Organization Best Practices

### Add New Components
```
src/components/YourComponent.tsx
```

### Add New Pages
```
src/app/your-route/page.tsx
```

### Add Utilities
```
src/lib/yourUtility.ts
```

### Add Types/Interfaces
Use inline interfaces in component files or create a `src/types/` directory for shared types.

## Configuration Files

### `tsconfig.json`
- TypeScript compiler options
- Path aliases configured with `@/*` pointing to `src/*`

### `next.config.ts`
- Image optimization for YouTube and Pexels
- ESLint configuration

### `tailwind.config.js`
- Tailwind CSS customization
- Design tokens and theme

### `postcss.config.js`
- Tailwind CSS and Autoprefixer

## Performance

- Next.js automatic code splitting
- Optimized CSS with Tailwind
- Image optimization for external sources
- Client-side rendering with localStorage for instant data

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test locally with `npm run dev`
4. Commit with clear messages
5. Push and create a pull request

## License

This project is private and maintained by the Knotloop team.

## Support

For issues and questions, please refer to the project documentation or contact the development team.

## Future Enhancements

- Backend API integration
- Real database (PostgreSQL/Supabase)
- User authentication
- Video upload functionality
- Analytics and tracking
- Advanced content management
