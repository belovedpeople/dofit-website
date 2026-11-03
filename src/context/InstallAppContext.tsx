'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallAppContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
  isAppMode: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  updateAvailable: boolean;
  applyUpdate: () => void;
  triggerInstall: () => void;
  showModal: boolean;
  setShowModal: (val: boolean) => void;
  openChatModal: () => void;
  closeChatModal: () => void;
  isChatModalOpen: boolean;
}

const InstallAppContext = createContext<InstallAppContextType | undefined>(undefined);

export function InstallAppProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isAppMode, setIsAppMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // 1. STRICT DETECT: Is this REALLY running as an installed PWA app?
    // In standard Chrome/Safari/Edge browsers, display-mode is 'browser'.
    // Only when installed and launched as an app from home screen or desktop is display-mode 'standalone' or 'fullscreen'.
    const checkIsApp = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
      const isMinimalUi = window.matchMedia('(display-mode: minimal-ui)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isUrlPreview = new URLSearchParams(window.location.search).get('mode') === 'app';

      return isStandalone || isFullscreen || isMinimalUi || isIOSStandalone || isUrlPreview;
    };

    const isApp = checkIsApp();
    setIsAppMode(isApp);
    setIsInstalled(isApp);

    if (isApp) {
      document.documentElement.classList.add('app-mode');
    } else {
      document.documentElement.classList.remove('app-mode');
    }

    // Listen for display mode changes (e.g. user installs and window switches)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsAppMode(true);
        setIsInstalled(true);
        document.documentElement.classList.add('app-mode');
      }
    };
    mediaQuery.addEventListener('change', handleDisplayChange);

    // 2. Register Service Worker & Handle Updates (Background Check & Notification)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Check if a new version is waiting
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
            setUpdateAvailable(true);
          }

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New update is ready!
                  setWaitingWorker(newWorker);
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.log('ServiceWorker registration error:', err);
        });

      // Reload when the new service worker takes over
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // 3. Detect operating system
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isAndroidDevice = /android/.test(ua);
    setIsIOS(isIosDevice);
    setIsAndroid(isAndroidDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsAppMode(true);
      document.documentElement.classList.add('app-mode');
      setDeferredPrompt(null);
      setShowModal(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      mediaQuery.removeEventListener('change', handleDisplayChange);
    };
  }, []);

  const applyUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsAppMode(true);
        document.documentElement.classList.add('app-mode');
        setDeferredPrompt(null);
      }
    } else {
      setShowModal(true);
    }
  };

  const openChatModal = () => {
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
  };

  return (
    <InstallAppContext.Provider
      value={{
        deferredPrompt,
        isInstalled,
        isAppMode,
        isIOS,
        isAndroid,
        updateAvailable,
        applyUpdate,
        triggerInstall,
        showModal,
        setShowModal,
        openChatModal,
        closeChatModal,
        isChatModalOpen,
      }}
    >
      {children}
    </InstallAppContext.Provider>
  );
}

export function useInstallApp() {
  const context = useContext(InstallAppContext);
  if (!context) {
    throw new Error('useInstallApp must be used within an InstallAppProvider');
  }
  return context;
}
