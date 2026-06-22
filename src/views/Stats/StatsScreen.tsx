import { useGameStore } from '../../store/gameStore';
import { useT } from '../../i18n';

export function StatsScreen() {
  const { setScreen, stats, resetStats } = useGameStore();
  const t = useT();
  const winRate = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;

  const mainStats = [
    { label: t('gamesPlayed'), value: stats.totalGames, color: '#E0EDE1' },
    { label: t('winRatePct'),  value: `${winRate}%`,    color: '#C9A84C' },
    { label: t('winsLabel'),   value: stats.wins,        color: '#5ECC86' },
    { label: t('lossesLabel'), value: stats.losses,      color: '#E05A5A' },
  ];

  const aiLevels = [
    { key: 'easy'   as const, label: t('easyLabel'),   color: '#5ECC86' },
    { key: 'medium' as const, label: t('mediumLabel'), color: '#C9A84C' },
    { key: 'hard'   as const, label: t('hardLabel'),   color: '#E05A5A' },
  ];

  return (
    <div className="screen-enter" style={{
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(26,61,28,0.5) 0%, #050B06 65%)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 24px',
    }}>
      <button onClick={() => setScreen('home')} style={backBtnStyle}>{t('back')}</button>

      <h2 style={{ ...headingStyle, animation: 'fadeUp 0.4s ease-out' }}>{t('statsTitle')}</h2>

      {stats.totalGames === 0 ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          animation: 'fadeUp 0.4s ease-out 0.1s both',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', marginBottom: 20,
            background: 'rgba(94,204,134,0.06)', border: '1px solid rgba(94,204,134,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="14" stroke="#3A5A40" strokeWidth="2"/>
              <path d="M11 18h14M18 11v14" stroke="#3A5A40" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#3A5A40', margin: '0 0 8px' }}>{t('noGames')}</p>
          <p style={{ fontSize: 13, color: '#2A3A2A', margin: 0 }}>{t('noGamesDesc')}</p>
        </div>
      ) : (
        <div className="scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeUp 0.4s ease-out 0.06s both' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {mainStats.map(s => (
              <div key={s.label} style={cardStyle}>
                <div style={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#3A5A40', marginTop: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3A5A40', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('winsVsAI')}
            </div>
            {aiLevels.map(level => (
              <div key={level.key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: level.color, flexShrink: 0, boxShadow: `0 0 6px ${level.color}80` }} />
                <span style={{ flex: 1, fontSize: 14, color: '#B0C8B4', fontWeight: 500 }}>{level.label}</span>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#E0EDE1', minWidth: 30, textAlign: 'right' }}>
                  {stats.winsVsAI[level.key]}
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...cardStyle, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(94,204,134,0.08)', border: '1px solid rgba(94,204,134,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="6" cy="5" r="3" fill="#5ECC86" opacity="0.9"/>
                  <path d="M1 15c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#5ECC86" strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
                  <circle cx="13" cy="5" r="3" fill="#C9A84C" opacity="0.7"/>
                  <path d="M10 15c0-2.76 2.24-5 5-5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                </svg>
              </div>
              <span style={{ fontSize: 14, color: '#B0C8B4', fontWeight: 500 }}>{t('pvpWins')}</span>
            </div>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#E0EDE1' }}>{stats.winsPvp}</span>
          </div>

          <button
            className="btn-outline"
            style={{ color: '#E05A5A', borderColor: 'rgba(224,90,90,0.2)', marginTop: 4 }}
            onClick={() => { if (confirm(t('confirmReset'))) resetStats(); }}
          >
            {t('resetStats')}
          </button>
        </div>
      )}
    </div>
  );
}

const backBtnStyle: React.CSSProperties = {
  alignSelf: 'flex-start', background: 'none', border: 'none',
  color: '#3A7A50', fontSize: 14, cursor: 'pointer', padding: '4px 0',
  marginBottom: 28, fontWeight: 600,
};

const headingStyle: React.CSSProperties = {
  fontSize: 30, fontWeight: 800, margin: '0 0 24px',
  background: 'linear-gradient(135deg, #FFFFFF 0%, #B8D4BC 60%, #5ECC86 100%)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 16, padding: '16px 14px', textAlign: 'center',
  display: 'flex', flexDirection: 'column',
};
