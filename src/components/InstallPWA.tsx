import { useEffect, useState } from 'react';

const InstallPWA = () => {
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Check if the install button should be shown
    const installButton = document.getElementById('install-button');
    if (installButton) {
      setShowInstallButton(true);
    }
  }, []);

  if (!showInstallButton) {
    return null;
  }

  return (
    <button
      id="install-button"
      className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
      style={{ display: 'none' }}
    >
      Install App
    </button>
  );
};

export default InstallPWA; 