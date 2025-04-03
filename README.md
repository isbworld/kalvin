# Dog Breed Navigator PWA

A Progressive Web Application that helps users identify dog breeds and provides detailed information about their characteristics, temperament, and care requirements.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v17 or higher)
- NGINX (v1.20 or higher)
- Hugging Face API key

## Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd DogBreedNavigator
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/dogbreed
   HUGGINGFACE_API_KEY=your_api_key
   SESSION_SECRET=your_session_secret
   ```

4. **Set Up Database**
   ```bash
   # Create PostgreSQL database
   createdb dogbreed
   
   # Run database migrations
   npm run db:push
   ```

5. **Build the Application**
   ```bash
   npm run build
   ```

6. **Configure NGINX**
   Create a new NGINX configuration file at `/etc/nginx/sites-available/dogbreed`:
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       # Frontend
       location / {
           root /path/to/DogBreedNavigator/dist/public;
           try_files $uri $uri/ /index.html;
           expires 30d;
           add_header Cache-Control "public, no-transform";
       }

       # API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Static assets
       location /assets {
           alias /path/to/DogBreedNavigator/dist/public/assets;
           expires 30d;
           add_header Cache-Control "public, no-transform";
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/dogbreed /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Start the Application**
   ```bash
   # Start the Node.js server
   node dist/index.js
   ```

## Development

To run the application in development mode:
```bash
npm run dev
```

## PWA Features

- Installable on devices
- Offline functionality
- Push notifications
- Service worker for caching
- Responsive design
- App-like experience

## Security Considerations

- Ensure HTTPS is configured for production
- Keep API keys secure
- Regularly update dependencies
- Follow security best practices for PostgreSQL
- Configure proper CORS settings

## Performance Optimization

- Assets are automatically optimized during build
- Code splitting is implemented
- Service worker caches static assets
- Images are optimized
- Lazy loading is implemented

## Support

For support, please refer to the documentation in the `docs` directory or create an issue in the repository.

## License

[Your License Here]