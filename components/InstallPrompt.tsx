'use client';

import { useEffect, useState } from 'react';
import { Download, X, Share, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [prompt, setPrompt]       = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible]     = useState(false);
  const [isIOS, setIsIOS]         = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user already dismissed
    if (sessionStorage.getItem('am_install_dismissed')) {
      setDismissed(true);
      return;
    }

    // iOS detection
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream;
    setIsIOS(ios);

    if (ios) {
      // Show iOS instructions after a short delay
      setTimeout(() => setVisible(true), 3000);
      return;
    }

    // Android / Desktop: capture the install event
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem('am_install_dismissed', '1');
    setDismissed(true);
  }

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setVisible(false);
  }

  if (!visible || dismissed || isInstalled) return null;

  // iOS — show share instructions
  if (isIOS) {
    return (
      <div className="fixed bottom-24 left-4 right-4 z-50 max-w-[398px] mx-auto">
        <div className="bg-gray-900 text-white rounded-3xl p-5 shadow-2xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src="/icons/icon-72.png" alt="" className="w-10 h-10 rounded-xl" />
              <div>
                <p className="font-bold text-sm">Add Trace to Home Screen</p>
                <p className="text-white/60 text-xs">Install for the full app experience</p>
              </div>
            </div>
            <button onClick={dismiss} className="text-white/50 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-xs text-white/80">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
              <Share className="w-5 h-5 flex-shrink-0 text-blue-400" />
              <span>Tap the <strong className="text-white">Share</strong> button at the bottom of Safari</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
              <Plus className="w-5 h-5 flex-shrink-0 text-blue-400" />
              <span>Tap <strong className="text-white">"Add to Home Screen"</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Android / Desktop
  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 max-w-[398px] mx-auto">
      <div className="bg-gray-900 text-white rounded-3xl p-4 shadow-2xl flex items-center gap-4">
        <img src="/icons/icon-72.png" alt="" className="w-12 h-12 rounded-2xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">Install Trace</p>
          <p className="text-white/60 text-xs">Add to your home screen for the full app experience</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={dismiss}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={install}
            className="flex items-center gap-1.5 bg-brand-500 text-white font-bold text-xs px-3 py-2 rounded-xl active:scale-95 transition-transform"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
