import { useGameStore } from '../../store/gameStore';
import { AIDifficulty } from '../../models/types';
import { useT } from '../../i18n';

function DifficultyOrb({ color }: { color: string }) {
  return (
    <div style={{
      width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
      background: `radial-gradient(circle at 38% 32%, ${color} 0%, ${color}88 55%, ${color}22 100%)`,
      boxShadow: `0 0 20px ${color}40, 0 4px 12px rgba(0,0,0,0.5)`,
    }} />
  );
}

export function DifficultyScreen() {
  const { setScreen, setPendingDifficulty, startGame } = useGameStore();
  const t = useT();

  const levels: { value: AIDifficulty; label: string; sub: string; depth: number; color: string }[] = [
    { value: 'easy',   label: t('easyLabel'),   sub: t('easySub'),   depth: 1, color: '#5ECC86' },
    { value: 'medium', label: t('mediumLabel'), sub: t('mediumSub'), depth: 3, color: '#C9A84C' },
    { value: 'hard',   label: t('hardLabel'),   sub: t('hardSub'),   depth: 7, color: '#E05A5A' },
  ];

  return (
    <div className="screen-enter" style={{
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(26,61,28,0.5) 0%, #050B06 65%)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 24px',
    }}>
      <button onClick={() => setScreen('board-select')} style={backBtnStyle}>{t('back')}</button>

      <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease-out' }}>
        <h2 style={headingStyle}>{t('aiDifficulty')}</h2>
        <p style={subStyle}>{t('chooseLevel')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeUp 0.4s ease-out 0.06s both' }}>
        {levels.map(level => (
          <button
            key={level.value}
            className="menu-card"
            onClick={() => { setPendingDifficulty(level.value); startGame(); }}
            style={{ textAlign: 'left' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <DifficultyOrb color={level.color} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: level.color }}>{level.label}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: level.color,
                    background: `${level.color}15`, border: `1px solid ${level.color}30`,
                    borderRadius: 6, padding: '1px 7px',
                  }}>
                    {t('depth')} {level.depth}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#3A5A40', fontWeight: 500 }}>{level.sub}</div>
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
