import { useGameStore } from '../../store/gameStore';
import { useT } from '../../i18n';

function CheckersLogo({ size = 80 }: { size?: number }) {
  return (
    <img
      src={import.meta.env.BASE_URL + 'logo.png'}
      width={size}
      height={size}
      style={{ objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(201,168,76,0.3))' }}
      alt="Checkers logo"
    />
  );
}

function BoardPattern() {
  const size = 28;
  return (
    <div style={{
      position: 'absolute', top: -40, right: -50,
      opacity: 0.055, transform: 'rotate(15deg)',
      pointerEvents: 'none',
    }}>
      {Array.from({ length: 6 }, (_, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {Array.from({ length: 6 }, (_, c) => (
            <div key={c} style={{
              width: size, height: size,
              background: (r + c) % 2 === 0 ? '#E8D5A3' : '#1A3D1C',
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function HomeScreen() {
  const setScreen = useGameStore(s => s.setScreen);
  const stats = useGameStore(s => s.stats);
  const t = useT();
  const winRate = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : null;

  return (
    <div className="screen-enter" style={{
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(26,61,28,0.5) 0%, #050B06 65%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 28px', position: 'relative', overflow: 'hidden',
    }}>
      <BoardPattern />

      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(94,204,134,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', marginBottom: 36, position: 'relative', animation: 'fadeUp 0.5s ease-out' }}>
        <CheckersLogo size={130} />
        <h1 style={{
          marginTop: 20, marginBottom: 4,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 44, fontWeight: 800,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #B8D4BC 50%, #5ECC86 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px', lineHeight: 1,
        }}>
          Emerald Checkers
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 8 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(94,204,134,0.2)' }} />
          <span style={{ fontSize: 10, letterSpacing: '4px', fontWeight: 700, color: '#3A7A50', textTransform: 'uppercase' }}>
            BOARD GAME
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(94,204,134,0.2)' }} />
        </div>
      </div>

      {stats.totalGames > 0 && (
        <div style={{
          display: 'flex', width: '100%', marginBottom: 28,
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, overflow: 'hidden',
          animation: 'fadeUp 0.5s ease-out 0.05s both',
        }}>
          {[
            { label: t('wins'), value: stats.wins, color: '#5ECC86' },
            { label: t('winRate'), value: `${winRate}%`, color: '#C9A84C' },
            { label: t('losses'), value: stats.losses, color: '#E05A5A' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center', padding: '14px 8px',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#4A6050', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, animation: 'fadeUp 0.5s ease-out 0.1s both' }}>
        <button className="btn-primary" onClick={() => setScreen('mode-select')}>
          {t('newGame')}
        </button>
        <button className="btn-ghost" onClick={() => setScreen('stats')}>
          {t('statistics')}
        </button>
        <button className="btn-ghost" onClick={() => setScreen('settings')}>
          {t('settings')}
        </button>
      </div>

      <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#1A3D1C' }} />
        <span style={{ fontSize: 11, color: '#2A4A30', fontWeight: 500 }}>v1.0.0</span>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#1A3D1C' }} />
      </div>
    </div>
  );
}
