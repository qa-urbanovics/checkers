import { useGameStore } from '../../store/gameStore';
import { BoardSize } from '../../models/types';
import { useT } from '../../i18n';

function MiniBoardPreview({ size, scale = 1 }: { size: 8 | 10; scale?: number }) {
  const cellPx = Math.floor((72 * scale) / size);
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
  const isTablet = window.innerWidth > 600;

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

  const maxW = 620;

  return (
    <div className="screen-enter" style={{
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(26,61,28,0.5) 0%, #050B06 65%)',
      display: 'flex', flexDirection: 'column',
      padding: isTablet ? '48px 48px' : '20px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: isTablet ? maxW : undefined, margin: '0 auto' }}>
        <button onClick={() => setScreen('mode-select')} style={{
          display: 'block', background: 'none', border: 'none',
          color: '#3A7A50', fontSize: isTablet ? 17 : 14, cursor: 'pointer', padding: '4px 0',
          marginBottom: isTablet ? 40 : 32, fontWeight: 600,
        }}>{t('back')}</button>

        <div style={{ marginBottom: isTablet ? 40 : 32, animation: 'fadeUp 0.4s ease-out' }}>
          <h2 style={{
            fontSize: isTablet ? 44 : 30, fontWeight: 800, margin: '0 0 8px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #B8D4BC 60%, #5ECC86 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{t('boardSize')}</h2>
          <p style={{ fontSize: isTablet ? 17 : 14, color: '#3A5A40', margin: 0, fontWeight: 500 }}>{t('chooseBoard')}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: isTablet ? 20 : 14, animation: 'fadeUp 0.4s ease-out 0.06s both' }}>
          {options.map(opt => (
            <button
              key={opt.size}
              className="menu-card"
              onClick={() => handleSelect(opt.size)}
              style={{ textAlign: 'left', padding: isTablet ? '22px 24px' : undefined }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: isTablet ? 24 : 16 }}>
                <MiniBoardPreview size={opt.size} scale={isTablet ? 1.8 : 1} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: isTablet ? 24 : 20, fontWeight: 800, color: '#E0EDE1', marginBottom: isTablet ? 8 : 5 }}>{opt.label}</div>
                  <div style={{ fontSize: isTablet ? 16 : 13, color: '#3A5A40', marginBottom: isTablet ? 10 : 6, fontWeight: 500 }}>{opt.desc}</div>
                  <div style={{
                    display: 'inline-block', fontSize: isTablet ? 13 : 11, fontWeight: 700,
                    color: opt.accent, background: `${opt.accent}18`,
                    border: `1px solid ${opt.accent}40`,
                    borderRadius: 8, padding: isTablet ? '5px 14px' : '3px 10px',
                  }}>{opt.rules}</div>
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
