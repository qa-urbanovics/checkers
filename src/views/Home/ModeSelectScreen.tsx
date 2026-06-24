import { useGameStore } from '../../store/gameStore';
import { GameMode } from '../../models/types';
import { useT } from '../../i18n';

function PvpIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="10" cy="9" r="5" fill="#5ECC86" opacity="0.9"/>
      <path d="M3 24c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#5ECC86" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
      <circle cx="20" cy="9" r="5" fill="#C9A84C" opacity="0.9"/>
      <path d="M15 24c0-3.866 3.134-7 7-7h.5" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
    </svg>
  );
}

function AiIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="5" y="8" width="18" height="14" rx="4" stroke="#C9A84C" strokeWidth="1.8"/>
      <circle cx="10" cy="15" r="2" fill="#C9A84C"/>
      <circle cx="18" cy="15" r="2" fill="#C9A84C"/>
      <path d="M10 8V5M18 8V5" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="10" cy="5" r="1.2" fill="#5ECC86"/>
      <circle cx="18" cy="5" r="1.2" fill="#5ECC86"/>
      <path d="M10 19h8" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

export function ModeSelectScreen() {
  const { setScreen, setPendingMode } = useGameStore();
  const t = useT();
  const isTablet = window.innerWidth > 600;

  const modes: { value: GameMode; title: string; sub: string; icon: JSX.Element; accent: string }[] = [
    { value: 'pvp', title: t('pvpTitle'), sub: t('pvpSub'), icon: <PvpIcon />, accent: '94,204,134' },
    { value: 'ai',  title: t('aiTitle'),  sub: t('aiSub'),  icon: <AiIcon />,  accent: '201,168,76' },
  ];

  const maxW = isTablet ? 620 : undefined;
  const outerPad = isTablet ? '0 48px' : '20px 24px';

  return (
    <div className="screen-enter" style={{
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(26,61,28,0.5) 0%, #050B06 65%)',
      display: 'flex', flexDirection: 'column',
      justifyContent: isTablet ? 'center' : 'flex-start',
      padding: outerPad,
    }}>
      {/* centred content column */}
      <div style={{ width: '100%', maxWidth: maxW, margin: '0 auto' }}>
        <button onClick={() => setScreen('home')} style={{
          display: 'block', background: 'none', border: 'none',
          color: '#3A7A50', fontSize: isTablet ? 17 : 14, cursor: 'pointer', padding: '4px 0',
          marginBottom: isTablet ? 40 : 32, fontWeight: 600,
        }}>{t('back')}</button>

        <div style={{ marginBottom: isTablet ? 40 : 32, animation: 'fadeUp 0.4s ease-out' }}>
          <h2 style={{
            fontSize: isTablet ? 44 : 30, fontWeight: 800, margin: '0 0 8px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #B8D4BC 60%, #5ECC86 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{t('gameMode')}</h2>
          <p style={{ fontSize: isTablet ? 17 : 14, color: '#3A5A40', margin: 0, fontWeight: 500 }}>{t('chooseMode')}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: isTablet ? 20 : 14, animation: 'fadeUp 0.4s ease-out 0.06s both' }}>
          {modes.map(mode => (
            <button
              key={mode.value}
              className="menu-card"
              onClick={() => { setPendingMode(mode.value); setScreen('board-select'); }}
              style={{ textAlign: 'left', padding: isTablet ? '22px 24px' : undefined }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: isTablet ? 24 : 16 }}>
                <div style={{
                  width: isTablet ? 68 : 54, height: isTablet ? 68 : 54,
                  borderRadius: isTablet ? 20 : 16, flexShrink: 0,
                  background: `rgba(${mode.accent},0.08)`,
                  border: `1px solid rgba(${mode.accent},0.2)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ transform: isTablet ? 'scale(1.5)' : undefined }}>
                    {mode.icon}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: isTablet ? 22 : 18, fontWeight: 700, color: '#E0EDE1', marginBottom: isTablet ? 6 : 4 }}>{mode.title}</div>
                  <div style={{ fontSize: isTablet ? 16 : 13, color: '#3A5A40', fontWeight: 500 }}>{mode.sub}</div>
                </div>
                <div style={{ color: '#2A4A30', fontSize: isTablet ? 28 : 20 }}>›</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
