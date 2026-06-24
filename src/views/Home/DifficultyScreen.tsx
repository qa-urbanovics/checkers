import { useGameStore } from '../../store/gameStore';
import { AIDifficulty } from '../../models/types';
import { useT } from '../../i18n';

function DifficultyOrb({ color, size = 54 }: { color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `radial-gradient(circle at 38% 32%, ${color} 0%, ${color}88 55%, ${color}22 100%)`,
      boxShadow: `0 0 ${size * 0.4}px ${color}40, 0 4px 12px rgba(0,0,0,0.5)`,
    }} />
  );
}

export function DifficultyScreen() {
  const { setScreen, setPendingDifficulty, startGame, pendingBoardSize } = useGameStore();
  const t = useT();
  const isTablet = window.innerWidth > 600;

  const hardDepth = pendingBoardSize === 10 ? 5 : 7;

  const levels: { value: AIDifficulty; label: string; sub: string; depth: number; color: string }[] = [
    { value: 'easy',   label: t('easyLabel'),   sub: t('easySub'),   depth: 1,         color: '#5ECC86' },
    { value: 'medium', label: t('mediumLabel'), sub: t('mediumSub'), depth: 3,         color: '#C9A84C' },
    { value: 'hard',   label: t('hardLabel'),   sub: t('hardSub'),   depth: hardDepth, color: '#E05A5A' },
  ];

  return (
    <div className="screen-enter" style={{
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(26,61,28,0.5) 0%, #050B06 65%)',
      display: 'flex', flexDirection: 'column',
      justifyContent: isTablet ? 'center' : 'flex-start',
      padding: isTablet ? '0 48px' : '20px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: isTablet ? 620 : undefined, margin: '0 auto' }}>
        <button onClick={() => setScreen('board-select')} style={{
          display: 'block', background: 'none', border: 'none',
          color: '#3A7A50', fontSize: isTablet ? 17 : 14, cursor: 'pointer', padding: '4px 0',
          marginBottom: isTablet ? 40 : 32, fontWeight: 600,
        }}>{t('back')}</button>

        <div style={{ marginBottom: isTablet ? 40 : 32, animation: 'fadeUp 0.4s ease-out' }}>
          <h2 style={{
            fontSize: isTablet ? 44 : 30, fontWeight: 800, margin: '0 0 8px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #B8D4BC 60%, #5ECC86 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{t('aiDifficulty')}</h2>
          <p style={{ fontSize: isTablet ? 17 : 14, color: '#3A5A40', margin: 0, fontWeight: 500 }}>{t('chooseLevel')}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: isTablet ? 20 : 14, animation: 'fadeUp 0.4s ease-out 0.06s both' }}>
          {levels.map(level => (
            <button
              key={level.value}
              className="menu-card"
              onClick={() => { setPendingDifficulty(level.value); startGame(); }}
              style={{ textAlign: 'left', padding: isTablet ? '22px 24px' : undefined }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: isTablet ? 24 : 16 }}>
                <DifficultyOrb color={level.color} size={isTablet ? 72 : 54} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: isTablet ? 6 : 4 }}>
                    <span style={{ fontSize: isTablet ? 22 : 18, fontWeight: 700, color: level.color }}>{level.label}</span>
                    <span style={{
                      fontSize: isTablet ? 12 : 10, fontWeight: 700, color: level.color,
                      background: `${level.color}15`, border: `1px solid ${level.color}30`,
                      borderRadius: 6, padding: isTablet ? '2px 10px' : '1px 7px',
                    }}>{t('depth')} {level.depth}</span>
                  </div>
                  <div style={{ fontSize: isTablet ? 16 : 13, color: '#3A5A40', fontWeight: 500 }}>{level.sub}</div>
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
