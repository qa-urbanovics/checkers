import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useT } from '../../i18n';
import { TIP_PRODUCTS, TipProductId, purchase, getProductPrice, isStoreAvailable } from '../../services/purchaseService';

const tipMeta: Record<TipProductId, { icon: string; tKey: 'tipTea' | 'tipCoffee' | 'tipLunch' }> = {
  tip_small:  { icon: '\u2615', tKey: 'tipTea' },
  tip_medium: { icon: '\u2615', tKey: 'tipCoffee' },
  tip_large:  { icon: '\uD83C\uDF5D', tKey: 'tipLunch' },
};

export function TipJarScreen() {
  const { setScreen } = useGameStore();
  const t = useT();
  const isTablet = window.innerWidth > 600;
  const [buying, setBuying] = useState<string | null>(null);
  const [thanked, setThanked] = useState(false);
  const maxW = isTablet ? 640 : undefined;

  const handlePurchase = async (id: TipProductId) => {
    setBuying(id);
    const ok = await purchase(id);
    setBuying(null);
    if (ok) setThanked(true);
  };

  return (
    <div className="screen-enter" style={{
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(26,61,28,0.5) 0%, #050B06 65%)',
      display: 'flex', flexDirection: 'column',
      padding: isTablet ? '32px 48px' : '20px 24px', overflow: 'hidden',
      alignItems: isTablet ? 'center' : undefined,
    }}>
      <div style={{ width: '100%', maxWidth: maxW, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <button onClick={() => setScreen('settings')} style={{
          alignSelf: 'flex-start', background: 'none', border: 'none',
          color: '#3A7A50', fontSize: isTablet ? 17 : 14, cursor: 'pointer', padding: '4px 0',
          marginBottom: isTablet ? 32 : 28, fontWeight: 600,
        }}>{t('back')}</button>

        <h2 style={{
          fontSize: isTablet ? 44 : 30, fontWeight: 800, margin: isTablet ? '0 0 12px' : '0 0 8px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #B8D4BC 60%, #5ECC86 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          animation: 'fadeUp 0.4s ease-out',
        }}>{t('tipJarTitle')}</h2>

        <p style={{
          fontSize: isTablet ? 16 : 14, color: '#6A8A70', lineHeight: 1.5,
          marginBottom: isTablet ? 36 : 28, animation: 'fadeUp 0.4s ease-out 0.04s both',
        }}>{t('tipJarDesc')}</p>

        {thanked ? (
          <div style={{
            textAlign: 'center', padding: isTablet ? '48px 24px' : '36px 16px',
            animation: 'fadeUp 0.4s ease-out',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{'\u2764\uFE0F'}</div>
            <h3 style={{ fontSize: isTablet ? 28 : 22, fontWeight: 800, color: '#5ECC86', marginBottom: 8 }}>
              {t('tipThanks')}
            </h3>
            <p style={{ fontSize: isTablet ? 16 : 14, color: '#6A8A70' }}>
              {t('tipThanksSub')}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: isTablet ? 14 : 10,
            animation: 'fadeUp 0.4s ease-out 0.08s both',
          }}>
            {TIP_PRODUCTS.map(tip => {
              const meta = tipMeta[tip.id];
              const livePrice = getProductPrice(tip.id);
              const price = livePrice ?? tip.price;
              const loading = buying === tip.id;

              return (
                <button
                  key={tip.id}
                  onClick={() => handlePurchase(tip.id)}
                  disabled={loading || buying !== null}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: isTablet ? 18 : 14,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: isTablet ? 20 : 16, padding: isTablet ? '22px 22px' : '16px 16px',
                    cursor: loading ? 'wait' : 'pointer',
                    opacity: (buying !== null && !loading) ? 0.5 : 1,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{
                    width: isTablet ? 52 : 44, height: isTablet ? 52 : 44,
                    borderRadius: isTablet ? 16 : 14,
                    background: 'linear-gradient(135deg, rgba(94,204,134,0.15), rgba(94,204,134,0.05))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isTablet ? 26 : 22, flexShrink: 0,
                  }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: isTablet ? 17 : 15, fontWeight: 600, color: '#C0D8C4' }}>
                      {t(meta.tKey)}
                    </div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #5ECC86, #3A9E62)',
                    color: '#050B06', fontWeight: 800,
                    fontSize: isTablet ? 15 : 13,
                    padding: isTablet ? '10px 20px' : '8px 16px',
                    borderRadius: 12, flexShrink: 0,
                  }}>
                    {loading ? '...' : price}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!isStoreAvailable() && !thanked && (
          <p style={{
            fontSize: 12, color: '#3A5A40', textAlign: 'center',
            marginTop: isTablet ? 24 : 16, lineHeight: 1.4,
          }}>
            {t('tipUnavailable')}
          </p>
        )}
      </div>
    </div>
  );
}
