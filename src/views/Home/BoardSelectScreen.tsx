import { useGameStore } from '../../store/gameStore';
import { BoardSize } from '../../models/types';
import { useT } from '../../i18n';

function MiniBoardPreview({ size }: { size: 8 | 10 }) {
  const cellPx = Math.floor(72 / size);
  return (
    <div style={{ borderRadius: 6, overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
      {Array.from({ length: size }, (_, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {Array.from({ length: size }, (_, c) => (
            <div key={c} style={{
              width: cellPx, height: cellPx,
              background: (r + c) % 2 === 0 ? '#E8D5A3' : '#1A3D1C',
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function BoardSelectScreen() {
  const { setScreen, setPendingBoardSize, pendingMode } = useGameStore();
  const t = useT();

  const options: { size: BoardSize; label: string; desc: string; rules: string; accent: string }[] = [
    { size: 8,  label: '8 × 8',   desc: t('board8desc'),  rules: t('russianRules'), accent: '#5ECC86' },
    { size: 10, label: '10 × 10', desc: t('board10desc'), rules: t('intlRules'),    accent: '#C9A84C' },
  ];

  const handleSelect = (size: BoardSize) => {
    setPendingBoardSize(size);
    if (pendingMode === 'ai') {
      setScreen('difficulty-select');
    } else {
      useGameStore.getState().startGame();
    }
  };

  return (
    <div className="screen-enter" style={{
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(26,61,28,0.5) 0%, #050B06 65%)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 24px',
    }}>
      <button onClick={() => setScreen('mode-select')} style={backBtnStyle}>{t('back')}</button>

      <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease-out' }}>
        <h2 style={headingStyle}>{t('boardSize')}</h2>
        <p style={subStyle}>{t('chooseBoard')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeUp 0.4s ease-out 0.06s both' }}>
        {options.map(opt => (
          <button
            key={opt.size}
            className="menu-card"
            onClick={() => handleSelect(opt.size)}
            style={{ textAlign: 'left' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <MiniBoardPreview size={opt.size} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#E0EDE1', marginBottom: 5 }}>{opt.label}</div>
                <div style={{ fontSize: 13, color: '#3A5A40', marginBottom: 6, fontWeight: 500 }}>{opt.desc}</div>
                <div style={{
                  display: 'inline-block', fontSize: 11, fontWeight: 700,
                  color: opt.accent,
                  background: `${opt.accent}18`,
                  border: `1px solid ${opt.accent}40`,
                  borderRadius: 8, padding: '3px 10px',
                }}>
                  {opt.rules}
                </div>
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
