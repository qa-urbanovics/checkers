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

  const modes: { value: GameMode; title: string; sub: string; icon: JSX.Element; accent: string }[] = [
    { value: 'pvp', title: t('pvpTitle'), sub: t('pvpSub'), icon: <PvpIcon />, accent: '94,204,134' },
    { value: 'ai',  title: t('aiTitle'),  sub: t('aiSub'),  icon: <AiIcon />,  accent: '201,168,76' },
  ];

  return (
    <div className="screen-enter" style={{
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(26,61,28,0.5) 0%, #050B06 65%)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 24px',
    }}>
      <button onClick={() => setScreen('home')} style={backBtnStyle}>{t('back')}</button>

      <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease-out' }}>
        <h2 style={headingStyle}>{t('gameMode')}</h2>
        <p style={subStyle}>{t('chooseMode')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeUp 0.4s ease-out 0.06s both' }}>
        {modes.map(mode => (
          <button
            key={mode.value}
            className="menu-card"
            onClick={() => { setPendingMode(mode.value); setScreen('board-select'); }}
            style={{ textAlign: 'left' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 54, height: 54, borderRadius: 16, flexShrink: 0,
                background: `rgba(${mode.accent},0.08)`,
                border: `1px solid rgba(${mode.accent},0.2)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {mode.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#E0EDE1', marginBottom: 4 }}>{mode.title}</div>
                <div style={{ fontSize: 13, color: '#3A5A40', fontWeight: 500 }}>{mode.sub}</div>
              </div>
              <div style={{ color: '#2A4A30', fontSize: 20 }}>›</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const backBtnStyle: React.CSSProperties = {
  alignSelf: 'flex-start', background: 'none', border: 'none',
  color: '#3A7A50', fontSize: 14, cursor: 'pointer', padding: '4px 0',
  marginBottom: 32, fontWeight: 600,
};

const headingStyle: React.CSSProperties = {
  fontSize: 30, fontWeight: 800, margin: '0 0 6px',
  background: 'linear-gradient(135deg, #FFFFFF 0%, #B8D4BC 60%, #5ECC86 100%)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
};

const subStyle: React.CSSProperties = {
  fontSize: 14, color: '#3A5A40', margin: 0, fontWeight: 500,
};
