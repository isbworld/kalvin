import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const result = dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (result.error) {
  console.warn('Warning: .env file not found or has syntax errors');
}

// Configuration object
export const config = {
  // API Keys
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY || '',
  },
  
  // Database
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  // Server
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
  
  // Other settings
  enableSwagger: process.env.ENABLE_SWAGGER === 'true',
  sessionSecret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  
  // Paths
  paths: {
    root: path.resolve(__dirname, '..'),
    reports: path.resolve(__dirname, '..', 'reports'),
    client: path.resolve(__dirname, '..', 'client'),
    dist: path.resolve(__dirname, '..', 'dist'),
  }
};

// Validate critical configuration
export function validateConfig() {
  const missingVars = [];
  
  if (!config.huggingface.apiKey) {
    missingVars.push('HUGGINGFACE_API_KEY');
  }
  
  if (!config.database.url && config.server.isProduction) {
    missingVars.push('DATABASE_URL');
  }
  
  if (config.server.isProduction && config.sessionSecret === 'default-secret-change-in-production') {
    console.warn('WARNING: Using default session secret in production, please set SESSION_SECRET env var');
  }
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Some features may not work correctly.');
  }
}

// Export default config
export default config; 