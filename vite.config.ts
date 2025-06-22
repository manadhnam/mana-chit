import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { imagetools } from 'vite-imagetools';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Define allowed environment variables for frontend
  const allowedEnvVars = [
    'VITE_API_URL',
    'VITE_API_VERSION',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_APP_NAME',
    'VITE_APP_URL',
    'VITE_APP_VERSION',
    'VITE_ENABLE_NOTIFICATIONS',
    'VITE_ENABLE_SMS',
    'VITE_ENABLE_ANALYTICS',
    'VITE_MAX_FILE_SIZE',
    'VITE_ALLOWED_FILE_TYPES',
    'VITE_ENABLE_2FA',
    'VITE_SESSION_TIMEOUT',
    'VITE_GOOGLE_MAPS_API_KEY',
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_SENTRY_DSN',
    'VITE_GOOGLE_ANALYTICS_ID',
  ];

  // Filter and validate environment variables
  const safeEnvVars: Record<string, string> = {};
  allowedEnvVars.forEach(key => {
    if (env[key]) {
      safeEnvVars[key] = env[key];
    }
  });

  return {
    plugins: [
      react(),
      imagetools(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'Mana Chit App',
          short_name: 'ManaChit',
          description: 'Smart Chit Fund Management Application',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/pwa-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: '/pwa-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            },
            {
              src: '/pwa-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ],
          start_url: '/',
          scope: '/',
        },
        workbox: {
          globPatterns: command === 'build' ? ['**/*.{js,css,html,ico,png,svg,woff2}'] : [],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.manachit\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.ts',
      coverage: {
        reporter: ['text', 'json', 'html'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Only expose safe environment variables to the frontend
      ...Object.keys(safeEnvVars).reduce((acc, key) => {
        acc[`import.meta.env.${key}`] = JSON.stringify(safeEnvVars[key]);
        return acc;
      }, {} as Record<string, string>),
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui': ['@headlessui/react', '@heroicons/react'],
            'charts': ['chart.js', 'react-chartjs-2'],
            'forms': ['react-hook-form'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      // Prevent source map leakage in production
      ...(mode === 'production' && {
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
    },
    // Security headers for development
    ...(command === 'serve' && {
      server: {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        },
      },
    }),
  };
});
