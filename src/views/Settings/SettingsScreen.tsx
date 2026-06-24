import { useGameStore } from '../../store/gameStore';
import { useT } from '../../i18n';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} style={{
      width: 50, height: 28, borderRadius: 14,
      background: on ? 'linear-gradient(135deg, #5ECC86, #3A9E62)' : 'rgba(255,255,255,0.08)',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.2s ease',
      boxShadow: on ? '0 0 14px rgba(94,204,134,0.35)' : 'none',
      flexShrink: 0,
      border: on ? '1px solid rgba(94,204,134,0.3)' : '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 24 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#FFF',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        transition: 'left 0.2s ease',
      }} />
    </div>
  );
}

export function SettingsScreen() {
  const { setScreen, settings, updateSettings } = useGameStore();
  const t = useT();
  const isTablet = window.innerWidth > 600;

  const boardThemes = [
    { value: 'emerald', label: t('emeraldBoard'), dark: '#1A3D1C', light: '#E8D5A3' },
    { value: 'classic', label: t('classicBoard'), dark: '#8B4513', light: '#EDCF9C' },
    { value: 'marble',  label: t('marbleBoard'),  dark: '#5A6A7A', light: '#E8E8E8' },
  ] as const;

  const Row = ({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: isTablet ? 20 : 16, padding: isTablet ? '20px 22px' : '15px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isTablet ? 16 : 12 }}>
        <span style={{ fontSize: isTablet ? 26 : 20 }}>{icon}</span>
        <span style={{ fontSize: isTablet ? 18 : 15, color: '#C0D8C4', fontWeight: 500 }}>{label}</span>
      </div>
      {children}
    </div>
  );

  const maxW = isTablet ? 640 : undefined;

  return (
    <div className="screen-enter" style={{
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(26,61,28,0.5) 0%, #050B06 65%)',
      display: 'flex', flexDirection: 'column',
      padding: isTablet ? '32px 48px' : '20px 24px', overflow: 'hidden',
      alignItems: isTablet ? 'center' : undefined,
    }}>
      <div style={{ width: '100%', maxWidth: isTablet ? maxW : undefined, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <button onClick={() => setScreen('home')} style={{
        alignSelf: 'flex-start', background: 'none', border: 'none',
        color: '#3A7A50', fontSize: isTablet ? 17 : 14, cursor: 'pointer', padding: '4px 0',
        marginBottom: isTablet ? 32 : 28, fontWeight: 600,
      }}>{t('back')}</button>

      <h2 style={{
        fontSize: isTablet ? 44 : 30, fontWeight: 800, margin: isTablet ? '0 0 32px' : '0 0 24px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #B8D4BC 60%, #5ECC86 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        animation: 'fadeUp 0.4s ease-out',
      }}>{t('settingsTitle')}</h2>

      <div className="scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: isTablet ? 14 : 10, animation: 'fadeUp 0.4s ease-out 0.06s both' }}>
        <Row icon="🔊" label={t('sound')}>
          <Toggle on={settings.soundEnabled} onToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })} />
        </Row>
        <Row icon="📳" label={t('haptics')}>
          <Toggle on={settings.hapticEnabled} onToggle={() => updateSettings({ hapticEnabled: !settings.hapticEnabled })} />
        </Row>
        <Row icon="💡" label={t('showMoves')}>
          <Toggle on={settings.showValidMoves} onToggle={() => updateSettings({ showValidMoves: !settings.showValidMoves })} />
        </Row>

        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <span style={{ fontSize: 20 }}>♟</span>
            <span style={{ fontSize: 15, color: '#C0D8C4', fontWeight: 500 }}>{t('pieceStyle')}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {([
              { value: 'classic', label: t('classicPieces'), p1: '#D8D0C8', p2: '#1C1C1C' },
              { value: 'color',   label: t('colorPieces'),   p1: '#C62828', p2: '#2A5A3A' },
            ] as const).map(theme => {
              const active = settings.pieceTheme === theme.value;
              return (
                <button key={theme.value} onClick={() => updateSettings({ pieceTheme: theme.value })} style={themeBtn(active)}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: theme.p1, boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }} />
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: theme.p2, boxShadow: '0 2px 4px rgba(0,0,0,0.6)' }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: active ? '#5ECC86' : '#3A5A40' }}>{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <span style={{ fontSize: 20 }}>🎨</span>
            <span style={{ fontSize: 15, color: '#C0D8C4', fontWeight: 500 }}>{t('boardThemeLabel')}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {boardThemes.map(theme => {
              const active = settings.boardTheme === theme.value;
              return (
                <button key={theme.value} onClick={() => updateSettings({ boardTheme: theme.value })} style={themeBtn(active)}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, borderRadius: 4, overflow: 'hidden' }}>
                    {[0,1,2,3].map(i => (
                      <div key={i} style={{ width: 9, height: 9, background: i % 2 === 0 ? theme.light : theme.dark }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: active ? '#5ECC86' : '#3A5A40' }}>{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <span style={{ fontSize: 20 }}>🌍</span>
            <span style={{ fontSize: 15, color: '#C0D8C4', fontWeight: 500 }}>{t('languageLabel')}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {([{ v: 'en', l: 'English' }, { v: 'ru', l: 'Русский' }, { v: 'es', l: 'Español' }] as const).map(lang => {
              const active = settings.language === lang.v;
              return (
                <button key={lang.v} onClick={() => updateSettings({ language: lang.v })} style={{
                  ...themeBtn(active), padding: '11px 4px',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#5ECC86' : '#3A5A40' }}>{lang.l}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


const sectionCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 16, padding: '15px 16px',
};

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
};

function themeBtn(active: boolean): React.CSSProperties {
  return {
    flex: 1, borderRadius: 12, padding: '10px 4px',
    border: active ? '1.5px solid rgba(94,204,134,0.6)' : '1px solid rgba(255,255,255,0.07)',
    background: active ? 'rgba(94,204,134,0.1)' : 'rgba(255,255,255,0.02)',
    cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    transition: 'all 0.15s ease',
  };
}
