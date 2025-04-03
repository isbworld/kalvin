# Developer Documentation - Dog Breed Identification Application

This guide provides detailed technical information for developers who need to maintain or extend the Dog Breed Identification application.

## Technical Architecture

### Frontend
- **React**: Used for UI components and state management
- **TailwindCSS + shadcn/ui**: For styling and UI components
- **TanStack Query**: For data fetching, caching, and synchronization
- **Wouter**: For client-side routing
- **React Hook Form + Zod**: For form validation

### Backend
- **Express**: API server
- **Multer**: For handling image uploads
- **In-Memory Storage**: Default storage implementation

## Core Components and Files

### Client-Side Components

#### Pages
- `client/src/pages/Home.tsx`: Main application page
- `client/src/pages/About.tsx`: Information about the application
- `client/src/pages/DNATests.tsx`: DNA test kit offerings
- `client/src/pages/not-found.tsx`: 404 page

#### UI Components
- `client/src/components/UploadState.tsx`: Manages photo upload UI
- `client/src/components/ResultsState.tsx`: Displays breed predictions
- `client/src/components/AttributeRadarChart.tsx`: Visualizes dog attributes
- `client/src/components/DNATestModal.tsx`: DNA test order form
- `client/src/components/FileUploader.tsx`: Handles file upload functionality
- `client/src/components/LoadingState.tsx`: Loading indicator

#### Services and Utilities
- `client/src/lib/queryClient.ts`: API request utilities
- `client/src/lib/utils.ts`: Common utility functions
- `client/src/services/apiService.ts`: API integration functions

### Server-Side Components

#### Core Server Files
- `server/index.ts`: Express server setup
- `server/routes.ts`: API route definitions
- `server/storage.ts`: Data storage interface

#### Service Files
- `server/breedService.ts`: Breed prediction logic
- `server/pdfGenerator.ts`: PDF report generation

#### Shared Types and Schemas
- `shared/types.ts`: TypeScript interfaces
- `shared/schema.ts`: Database schema definitions

## Data Flow

### Breed Prediction Flow
1. User uploads photos via `FileUploader` component
2. `Home` component submits FormData to backend via `apiRequest`
3. Backend processes images in `/api/predict-breed` endpoint
4. `breedService.ts` handles breed prediction and attribute calculation
5. Results returned to frontend and displayed in `ResultsState` component

### DNA Test Order Flow
1. User clicks "Order DNA Test" button in `ResultsState`
2. `DNATestModal` component opens with form
3. User selects kit type and enters contact information
4. Form validation handled by zod schema
5. On submission, confirmation message displayed

### PDF Report Generation Flow
1. User clicks "Generate Report" button in `ResultsState`
2. Report data sent to backend via `apiRequest`
3. Backend processes report in `/api/generate-report` endpoint
4. `pdfGenerator.ts` creates PDF with dog breed information
5. PDF URL returned to frontend and opened in new tab

## Image Processing

### Preprocessing Option
The application includes an optional image preprocessing step controlled by the `usePreprocessing` flag:

1. When enabled, the backend applies basic image enhancement:
   - Contrast adjustment
   - Feature enhancement
   - Background noise reduction

2. Implementation in `server/breedService.ts`:
   ```typescript
   // Lightweight preprocessing
   if (usePreprocessing) {
     // Apply image preprocessing logic
   }
   ```

## Adding New Features

### Adding a New Page
1. Create a new component in `client/src/pages/`
2. Add routing in `client/src/App.tsx`:
   ```tsx
   <Route path="/new-page" component={NewPage} />
   ```
3. Add navigation link in `client/src/components/Header.tsx`

### Adding a New API Endpoint
1. Create endpoint handler in `server/routes.ts`:
   ```typescript
   app.post('/api/new-endpoint', async (req, res) => {
     try {
       // Implementation
       res.json({ success: true, data });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```
2. Create frontend mutation in the appropriate component:
   ```typescript
   const newEndpointMutation = useMutation({
     mutationFn: async (data) => {
       const response = await apiRequest("POST", "/api/new-endpoint", data);
       return response.json();
     },
     onSuccess: (data) => {
       // Handle success
     },
   });
   ```

### Adding New Dog Breed Attributes
1. Update the `DogAttributes` interface in `shared/types.ts`:
   ```typescript
   export interface DogAttributes {
     // Add new attribute
     new_attribute: number;
   }
   ```
2. Update attribute calculation in `server/breedService.ts`
3. Add visualization in `client/src/components/AttributeRadarChart.tsx`

## Environment Setup

### Required API Keys
For production deployment, the following API keys may be required:

1. **Hugging Face API Key**: For breed prediction model access
   - Set as environment variable `HUGGING_FACE_API_KEY`

2. **Email Service API Key** (future feature): For sending PDF reports
   - Set as environment variable `EMAIL_API_KEY`

### Database Setup (Future Implementation)
The application is designed to support PostgreSQL database integration:

1. Schema defined in `shared/schema.ts`
2. Storage interface in `server/storage.ts`
3. To enable database integration:
   - Use the PostgreSQL database creation tool
   - Update environment variables with database credentials

## Performance Optimization

### Image Processing Optimization
The application uses lightweight image preprocessing to maintain performance:

1. Client-side image preview using `URL.createObjectURL`
2. Image resizing before upload to reduce bandwidth
3. Server-side processing optimized for speed

### State Management
TanStack Query is used for efficient data management:

1. Query caching reduces redundant API calls
2. Query invalidation ensures data freshness
3. Loading states managed automatically through query status

## Testing

### Manual Testing Checklist
- Image upload functionality
- Breed prediction accuracy
- PDF report generation
- DNA test order form validation
- Navigation between pages
- Responsive design on different screen sizes

### Planned Automated Testing
Future implementation planned for:
- React Testing Library for component tests
- Jest for unit tests
- Cypress for end-to-end testing

## Security Considerations

### Form Validation
All user inputs are validated using Zod schemas:

1. DNATestFormSchema in `client/src/components/DNATestModal.tsx`
2. Backend validation in API endpoints

### File Upload Security
File uploads are restricted:

1. Only image files accepted
2. Size limits enforced
3. Server-side validation of file types

## Deployment

The application is designed for deployment on Replit:

1. Use the Replit Deploy button for production deployment
2. Environment variables should be configured in Replit Secrets
3. Static assets are served from the built frontend bundle

## Troubleshooting Common Development Issues

### Image Upload Not Working
- Check file size limits in `server/routes.ts`
- Verify that multer middleware is correctly configured
- Check browser console for CORS or network errors

### API Connectivity Issues
- Verify that API endpoints match between frontend and backend
- Check environment variables for API keys
- Test API endpoints directly using curl or Postman

### Styling Problems
- Clear browser cache to refresh TailwindCSS styles
- Check for shadcn component import issues
- Verify that theme.json changes are being applied