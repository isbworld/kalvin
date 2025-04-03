# Dog Breed Navigator PWA Structure

## Project Overview
A Progressive Web Application (PWA) that helps users identify dog breeds and provides detailed information about their characteristics, temperament, and care requirements.

## Directory Structure

```
DogBreedNavigator/
├── client/                 # Frontend React application
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # CSS and styling files
│   └── utils/            # Utility functions
│
├── server/                # Backend Node.js application
│   ├── index.ts          # Main server entry point
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── models/           # Data models
│   └── services/         # Business logic
│
├── shared/                # Shared code between frontend and backend
│   ├── types/            # TypeScript type definitions
│   └── constants/        # Shared constants
│
├── dist/                  # Built application files
│   ├── public/           # Static assets
│   └── index.js          # Compiled server code
│
├── docs/                  # Documentation
│   ├── STRUCTURE.md      # This file
│   ├── USER_GUIDE.md     # User documentation
│   └── BREED_DATA.md     # Dog breed data documentation
│
├── logs/                  # Application logs
├── reports/              # Generated reports
└── attached_assets/      # Additional project assets
```

## Core Files

### Configuration Files
- `package.json`: Node.js dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite build configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration
- `drizzle.config.ts`: Database configuration
- `.env`: Environment variables

### Frontend Files
- `client/main.tsx`: Main React entry point
- `client/App.tsx`: Root React component
- `client/index.css`: Global styles
- `client/manifest.json`: PWA manifest
- `client/service-worker.ts`: Service worker for offline functionality

### Backend Files
- `server/index.ts`: Server entry point
- `server/routes/api.ts`: API routes
- `server/controllers/breedController.ts`: Breed-related logic
- `server/services/breedService.ts`: Breed business logic
- `server/models/breed.ts`: Breed data model

### Data Files
- `corrected_dog_breeds_attributes.json`: Dog breed data
- `generated-icon.png`: PWA icon

## Dependencies

### Frontend Dependencies
```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-*": "^1.0.0",  // UI components
    "@tanstack/react-query": "^5.60.5",
    "axios": "^1.8.4",
    "chart.js": "^4.4.8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "tailwindcss": "^3.4.1"
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "@huggingface/inference": "^2.6.4",
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "postgres": "^3.4.3",
    "drizzle-orm": "^0.29.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.1"
  }
}
```

### Development Dependencies
```json
{
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.16",
    "@types/react": "^18.2.52",
    "@typescript-eslint/eslint-plugin": "^6.20.0",
    "@typescript-eslint/parser": "^6.20.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "drizzle-kit": "^0.20.14",
    "esbuild": "^0.19.11",
    "eslint": "^8.56.0",
    "postcss": "^8.4.33",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.12"
  }
}
```

## Database Structure

### PostgreSQL Database
- Database Name: `dogbreed`
- Tables:
  - `breeds`: Stores breed information
  - `attributes`: Stores breed attributes
  - `predictions`: Stores breed predictions

### Database Schema
```sql
CREATE TABLE breeds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attributes (
    id SERIAL PRIMARY KEY,
    breed_id INTEGER REFERENCES breeds(id),
    size INTEGER,
    weight INTEGER,
    aggression INTEGER,
    trainability INTEGER,
    energy_level INTEGER,
    lifespan INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    breed_id INTEGER REFERENCES breeds(id),
    confidence FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables
Required environment variables in `.env`:
```
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/dogbreed
HUGGINGFACE_API_KEY=your_api_key
SESSION_SECRET=your_session_secret
```

## Build and Run

### Development
```bash
npm install        # Install dependencies
npm run dev       # Start development server
```

### Production
```bash
npm run build     # Build the application
node dist/index.js # Start production server
```

## PWA Features
- Installable on devices
- Offline functionality
- Push notifications
- Service worker for caching
- Responsive design
- App-like experience

## Security
- HTTPS required for PWA features
- API key protection
- Input validation
- CORS configuration
- Rate limiting

## Performance
- Code splitting
- Asset optimization
- Caching strategies
- Lazy loading
- Image optimization 