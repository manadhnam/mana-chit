// Environment variable utility functions
// This file provides type-safe access to environment variables

interface EnvironmentConfig {
  // API Configuration
  API_URL: string;
  API_VERSION: string;
  
  // Supabase Configuration
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  
  // Application Configuration
  APP_NAME: string;
  APP_URL: string;
  APP_VERSION: string;
  
  // Feature Flags
  ENABLE_NOTIFICATIONS: boolean;
  ENABLE_SMS: boolean;
  ENABLE_ANALYTICS: boolean;
  
  // File Upload Configuration
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string[];
  
  // Security Configuration
  ENABLE_2FA: boolean;
  SESSION_TIMEOUT: number;
  
  // External Services
  GOOGLE_MAPS_API_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  
  // Monitoring and Analytics
  SENTRY_DSN: string;
  GOOGLE_ANALYTICS_ID: string;
}

// Helper function to safely get environment variables
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[`VITE_${key}`];
  if (!value && defaultValue === undefined) {
    console.warn(`Environment variable VITE_${key} is not set`);
  }
  return value || defaultValue || '';
};

// Helper function to parse boolean environment variables
const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = getEnvVar(key);
  if (value === '') return defaultValue;
  return value.toLowerCase() === 'true';
};

// Helper function to parse number environment variables
const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = getEnvVar(key);
  if (value === '') return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to parse array environment variables
const getArrayEnvVar = (key: string, defaultValue: string[] = []): string[] => {
  const value = getEnvVar(key);
  if (value === '') return defaultValue;
  return value.split(',').map(item => item.trim());
};

// Environment configuration object
export const env: EnvironmentConfig = {
  // API Configuration
  API_URL: getEnvVar('API_URL', 'http://localhost:3000'),
  API_VERSION: getEnvVar('API_VERSION', 'v1'),
  
  // Supabase Configuration
  SUPABASE_URL: getEnvVar('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY'),
  
  // Application Configuration
  APP_NAME: getEnvVar('APP_NAME', 'Mana Chit'),
  APP_URL: getEnvVar('APP_URL', 'http://localhost:5173'),
  APP_VERSION: getEnvVar('APP_VERSION', '1.0.0'),
  
  // Feature Flags
  ENABLE_NOTIFICATIONS: getBooleanEnvVar('ENABLE_NOTIFICATIONS', true),
  ENABLE_SMS: getBooleanEnvVar('ENABLE_SMS', false),
  ENABLE_ANALYTICS: getBooleanEnvVar('ENABLE_ANALYTICS', false),
  
  // File Upload Configuration
  MAX_FILE_SIZE: getNumberEnvVar('MAX_FILE_SIZE', 5 * 1024 * 1024), // 5MB
  ALLOWED_FILE_TYPES: getArrayEnvVar('ALLOWED_FILE_TYPES', [
    'image/jpeg',
    'image/png',
    'application/pdf'
  ]),
  
  // Security Configuration
  ENABLE_2FA: getBooleanEnvVar('ENABLE_2FA', true),
  SESSION_TIMEOUT: getNumberEnvVar('SESSION_TIMEOUT', 3600), // 1 hour
  
  // External Services
  GOOGLE_MAPS_API_KEY: getEnvVar('GOOGLE_MAPS_API_KEY'),
  STRIPE_PUBLISHABLE_KEY: getEnvVar('STRIPE_PUBLISHABLE_KEY'),
  
  // Monitoring and Analytics
  SENTRY_DSN: getEnvVar('SENTRY_DSN'),
  GOOGLE_ANALYTICS_ID: getEnvVar('GOOGLE_ANALYTICS_ID'),
};

// Validation function to check required environment variables
export const validateEnvironment = (): void => {
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
  ];
  
  const missingVars = requiredVars.filter(key => !getEnvVar(key));
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.map(key => `VITE_${key}`));
    throw new Error(`Missing required environment variables: ${missingVars.map(key => `VITE_${key}`).join(', ')}`);
  }
};

// Development-only environment validation
if (import.meta.env.DEV) {
  validateEnvironment();
}

export default env; 