/// <reference types="vite-plugin-pwa/client" />
import { RegisterSWOptions } from 'vite-plugin-pwa/types';
import { registerSW } from 'virtual:pwa-register';

// Add TypeScript interface for the refresh prompt function
interface RefreshPromptEvent extends Event {
  preventDefault: () => void;
}

// Initialize the service worker with auto-update functionality
const updateSW = registerSW({
  onNeedRefresh() {
    // Show a confirmation dialog to the user
    if (confirm('New content available. Click OK to update.')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
  onRegistered(swRegistration: ServiceWorkerRegistration | undefined) {
    if (swRegistration) {
      // Check for updates every hour
      setInterval(() => {
        swRegistration.update();
      }, 60 * 60 * 1000);
    }
  },
  onRegisterError(error: Error) {
    console.error('Service worker registration failed:', error);
  }
} as RegisterSWOptions);

// Handle beforeinstallprompt event for PWA installation
window.addEventListener('beforeinstallprompt', (event: RefreshPromptEvent) => {
  // Prevent the default browser prompt
  event.preventDefault();
  
  // Store the event for later use
  const deferredPrompt = event;
  
  // Show your custom install prompt when appropriate
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', async () => {
      // Show the installation prompt
      if (deferredPrompt) {
        (deferredPrompt as any).prompt();
        const { outcome } = await (deferredPrompt as any).userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
      }
    });
  }
}); 