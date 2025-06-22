# Mana Chit Application

## Environment Setup

### Development Environment

1. Copy the environment template to create your local environment file:
```bash
cp env.template .env.development
```
n
2. Update the environment variables in `.env.development` with your local development values.

### Production Environment

1. Copy the environment template to create your production environment file:
```bash
cp env.template .env.production
```

2. Update the environment variables in `.env.production` with your production values.

### Required Environment Variables

The following environment variables are required for the application to function:

```plaintext
# API Configuration
VITE_API_URL=https://api.manachit.com
VITE_API_VERSION=v1

# Supabase Configuration (required)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application Configuration
VITE_APP_NAME=Mana Chit
VITE_APP_URL=https://manachit.com
VITE_APP_VERSION=1.0.0
```

### Optional Environment Variables

These variables have default values but can be overridden:

```plaintext
# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_SMS=true
VITE_ENABLE_ANALYTICS=true

# File Upload Configuration
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# Security Configuration
VITE_ENABLE_2FA=true
VITE_SESSION_TIMEOUT=3600
```

### External Services (Optional)

Configure these if you're using the respective services:

```plaintext
# External Services
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Monitoring and Analytics
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
```

## Environment Variable Usage

The application uses a type-safe environment configuration system. All environment variables are accessed through the `env` utility:

```typescript
import env from '@/utils/env';

// Example usage
const apiUrl = env.API_URL;
const maxFileSize = env.MAX_FILE_SIZE;
```

### Security Notes

1. Only variables prefixed with `VITE_` will be exposed to the client-side code.
2. Never store sensitive secrets (private keys, API secrets) in the frontend environment variables.
3. Use only public keys and tokens that are safe to expose to clients.
4. The application validates required environment variables on startup.

## Development vs Production

- Development: Uses `.env.development` file
- Production: Uses `.env.production` file
- CI/CD: Environment variables should be set in your CI/CD platform's configuration

## Building for Production

When building for production:

```bash
npm run build
```

This will:
1. Load the `.env.production` file
2. Validate all required environment variables
3. Build the application with production optimizations
4. Remove console.log statements and source maps 