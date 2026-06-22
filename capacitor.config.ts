import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // ── Bundle ID ──────────────────────────────────────────────────────────────
  // Must be unique in App Store. Register at developer.apple.com first.
  // Format: com.yourcompany.appname  (reverse DNS notation)
  appId: 'com.emeraldcourts.checkers',

  // ── App display name (shown under icon on home screen) ────────────────────
  appName: 'Шашки',

  // ── Built web assets directory ────────────────────────────────────────────
  webDir: 'dist',

  // ── iOS-specific settings ─────────────────────────────────────────────────
  ios: {
    // Content fills the full screen including under the status bar
    contentInset: 'always',

    // Minimum iOS version to support (App Store min is 16+ recommended)
    minVersion: '16.0',

    // Allow mixed content (not needed here, just in case)
    allowsLinkPreview: false,

    // Scroll settings — disable bounce for game-like feel
    scrollEnabled: false,
  },

  // ── Plugins configuration ─────────────────────────────────────────────────
  plugins: {
    StatusBar: {
      // Transparent status bar, overlays the content
      style: 'DARK',            // dark icons (visible on our light/medium BG)
      backgroundColor: '#000000',
      overlaysWebView: true,
    },
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#050B06',
      iosSpinnerStyle: 'small',
      spinnerColor: '#5ECC86',
      showSpinner: false,
    },
  },
};

export default config;
