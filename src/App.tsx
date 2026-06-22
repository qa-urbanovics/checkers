import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useGameStore } from './store/gameStore';
import { HomeScreen } from './views/Home/HomeScreen';
import { ModeSelectScreen } from './views/Home/ModeSelectScreen';
import { BoardSelectScreen } from './views/Home/BoardSelectScreen';
import { DifficultyScreen } from './views/Home/DifficultyScreen';
import { GameScreen } from './views/Game/GameScreen';
import { SettingsScreen } from './views/Settings/SettingsScreen';
import { StatsScreen } from './views/Stats/StatsScreen';
import { RulesScreen } from './views/Rules/RulesScreen';
import './App.css';

// ─────────────────────────────────────────────
// Device detection
// NOTE: modern iPads (iPadOS 13+) send "Macintosh" as user agent,
// so we CANNOT rely on UA alone — combine with screen width.
// ─────────────────────────────────────────────
function getDeviceType(): 'phone' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent;
  const w = window.innerWidth;

  // iPad: UA says Macintosh but has touch support, or classic iPad UA
  const isIpad =
    /iPad/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);

  // iPhone / Android phone
  const isPhone = /iPhone|iPod|Android/i.test(ua) && !isIpad;

  if (isIpad) return 'tablet';
  if (isPhone) return 'phone';

  // Browser / desktop: use width to decide layout
  if (w <= 500) return 'phone';      // narrow browser window
  if (w <= 1400) return 'tablet';    // 500-1400 → tablet layout (covers iPad Pro 12.9" landscape = 1366px)
  return 'desktop';                  // wide desktop monitors → show iPhone frame
}

const DEVICE = getDeviceType();

function App() {
  const screen = useGameStore(s => s.screen);

  // Configure native iOS status bar on startup
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setOverlaysWebView({ overlay: true });
    }
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'home':              return <HomeScreen />;
      case 'mode-select':       return <ModeSelectScreen />;
      case 'board-select':      return <BoardSelectScreen />;
      case 'difficulty-select': return <DifficultyScreen />;
      case 'game':              return <GameScreen />;
      case 'settings':          return <SettingsScreen />;
      case 'stats':             return <StatsScreen />;
      case 'rules':             return <RulesScreen />;
      default:                  return <HomeScreen />;
    }
  };

  // ── PHONE — full screen, no frame ─────────────────────────
  if (DEVICE === 'phone') {
    return (
      <div style={{
        width: '100%', height: '100dvh',
        background: '#050B06',
        overflow: 'hidden', position: 'relative',
      }}>
        {renderScreen()}
      </div>
    );
  }

  // ── TABLET (iPad) — centered panel, safe insets ────────────
  if (DEVICE === 'tablet') {
    return (
      <div style={{
        width: '100%', height: '100dvh',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(26,61,28,0.6) 0%, #020804 70%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Centered card — sized like a phone, feels native on iPad */}
        <div style={{
          width: 430,
          height: Math.min(window.innerHeight - 40, 932),
          borderRadius: 40,
          overflow: 'hidden',
          background: '#050B06',
          position: 'relative',
          boxShadow: `
            0 0 0 1px rgba(94,204,134,0.1),
            0 30px 100px rgba(0,0,0,0.8),
            0 0 80px rgba(26,61,28,0.3)
          `,
        }}>
          {/* Subtle status bar area */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 44, zIndex: 20,
            background: 'linear-gradient(to bottom, rgba(5,11,6,0.95) 60%, transparent)',
          }} />
          <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
            {renderScreen()}
          </div>
          {/* Home indicator */}
          <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 20 }}>
            <div style={{ width: 130, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.2)' }} />
          </div>
        </div>
      </div>
    );
  }

  // ── DESKTOP — iPhone 15 Pro simulation frame ───────────────
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '100vw', height: '100vh',
      background: 'radial-gradient(ellipse at 50% 40%, #0A1F0C 0%, #020502 70%)',
    }}>
      <div style={{
        position: 'relative',
        width: 390, height: 844,
        borderRadius: 52, overflow: 'hidden',
        background: '#050B06',
        boxShadow: `
          0 0 0 2px #1A2A1C,
          0 0 0 4px #0A120B,
          0 0 0 10px #0E150F,
          0 0 0 12px #1A2A1C,
          0 50px 150px rgba(0,0,0,0.95),
          inset 0 0 0 1px rgba(255,255,255,0.03)
        `,
      }}>
        {/* Status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 50, zIndex: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px',
          background: 'linear-gradient(to bottom, rgba(5,11,6,0.98) 60%, transparent)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600 }}>9:41</span>
          <div style={{ width: 120, height: 30, borderRadius: 20, background: '#000' }} />
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <svg width="16" height="11" viewBox="0 0 16 11" fill="rgba(255,255,255,0.85)">
              <rect x="0" y="3" width="3" height="8" rx="1" opacity="0.4"/>
              <rect x="4.5" y="2" width="3" height="9" rx="1" opacity="0.65"/>
              <rect x="9" y="0.5" width="3" height="10.5" rx="1" opacity="0.85"/>
              <rect x="13.5" y="0" width="2.5" height="11" rx="1"/>
            </svg>
            <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
              <rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke="rgba(255,255,255,0.35)"/>
              <rect x="21" y="3" width="2.5" height="5" rx="1.25" fill="rgba(255,255,255,0.4)"/>
              <rect x="2" y="2" width="14" height="7" rx="2" fill="rgba(255,255,255,0.9)"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div style={{ position: 'absolute', top: 50, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
          {renderScreen()}
        </div>

        {/* Home bar */}
        <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 20 }}>
          <div style={{ width: 130, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.25)' }} />
        </div>
      </div>
    </div>
  );
}

export default App;
