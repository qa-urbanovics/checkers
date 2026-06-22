import { useGameStore } from '../../store/gameStore';
import { useT } from '../../i18n';

interface Section {
  icon: string;
  en: { title: string; body: string };
  ru: { title: string; body: string };
  es: { title: string; body: string };
}

const SECTIONS: Section[] = [
  {
    icon: '◎',
    en: { title: 'Objective', body: 'Capture all opponent pieces, or block them so they have no moves left.' },
    ru: { title: 'Цель', body: 'Побить все шашки соперника или лишить его возможности ходить.' },
    es: { title: 'Objetivo', body: 'Captura todas las piezas del rival o bloquéalas sin movimientos.' },
  },
  {
    icon: '→',
    en: { title: 'Moving', body: 'Men move diagonally forward one square at a time, only on dark squares.' },
    ru: { title: 'Ход', body: 'Шашки ходят вперёд по диагонали на одну клетку, только по тёмным клеткам.' },
    es: { title: 'Movimiento', body: 'Las piezas se mueven diagonalmente hacia adelante una casilla, solo en casillas oscuras.' },
  },
  {
    icon: '×',
    en: { title: 'Capturing', body: 'Jump over an opponent\'s piece to an empty square behind it. Men can capture in any direction — including backward. Capturing is mandatory.' },
    ru: { title: 'Взятие', body: 'Перепрыгни через шашку соперника на пустую клетку за ней. Шашка может бить в любом направлении — в том числе назад. Взятие обязательно.' },
    es: { title: 'Captura', body: 'Salta sobre una pieza rival a la casilla vacía detrás. Las piezas pueden capturar en cualquier dirección, incluso hacia atrás. La captura es obligatoria.' },
  },
  {
    icon: '⛓',
    en: { title: 'Chain captures', body: 'After a capture, if another capture is possible from the new position, you must continue jumping in the same turn.' },
    ru: { title: 'Серия взятий', body: 'После взятия, если с новой позиции можно бить снова — обязан продолжить серию в том же ходу.' },
    es: { title: 'Capturas en cadena', body: 'Tras una captura, si desde la nueva posición puedes capturar de nuevo, debes continuar en el mismo turno.' },
  },
  {
    icon: '♛',
    en: { title: 'King (Flying King)', body: 'When a man reaches the last row, it becomes a King. Kings move any number of squares diagonally in any direction — like a bishop in chess. If a man is promoted during a capture chain, the chain stops at that square.' },
    ru: { title: 'Дамка (летунья)', body: 'Когда шашка достигает последнего ряда, она становится дамкой. Дамка ходит на любое расстояние по диагонали в любом направлении — как слон в шахматах. Если шашка превращается в дамку в процессе серии взятий — серия на этом прерывается.' },
    es: { title: 'Dama (voladora)', body: 'Cuando una pieza llega a la última fila, se convierte en Dama. Las Damas se mueven cualquier número de casillas en diagonal en cualquier dirección — como el alfil en ajedrez. Si una pieza se corona durante una cadena de capturas, la cadena se detiene.' },
  },
];

const DIFF_ROWS: Array<{
  en: [string, string, string];
  ru: [string, string, string];
  es: [string, string, string];
}> = [
  {
    en: ['Feature', '8×8 Russian', '10×10 International'],
    ru: ['Правило', '8×8 Русские', '10×10 Международные'],
    es: ['Regla', '8×8 Rusas', '10×10 Internacionales'],
  },
  {
    en: ['Pieces', '12 each', '20 each'],
    ru: ['Шашек', '12 у каждого', '20 у каждого'],
    es: ['Piezas', '12 cada uno', '20 cada uno'],
  },
  {
    en: ['Capture rule', 'Any capture valid', 'Must capture most'],
    ru: ['Взятие', 'Любое взятие', 'Бить максимум'],
    es: ['Captura', 'Cualquier captura', 'Capturar el máximo'],
  },
  {
    en: ['On promotion', 'Chain stops', 'Chain stops'],
    ru: ['Превращение в дамку', 'Серия прерывается', 'Серия прерывается'],
    es: ['Al coronar', 'La cadena se detiene', 'La cadena se detiene'],
  },
  {
    en: ['King movement', 'Any distance', 'Any distance'],
    ru: ['Ход дамки', 'Любое расстояние', 'Любое расстояние'],
    es: ['Movimiento dama', 'Cualquier distancia', 'Cualquier distancia'],
  },
];

export function RulesScreen() {
  const setScreen = useGameStore(s => s.setScreen);
  const lang = useGameStore(s => s.settings.language) as 'en' | 'ru' | 'es';
  const t = useT();

  return (
    <div className="screen-enter" style={{
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 30% 10%, rgba(26,61,28,0.45) 0%, #050B06 65%)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => setScreen('home')}
          style={{
            background: 'none', border: 'none', color: '#5ECC86',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '4px 0',
          }}
        >
          {t('back')}
        </button>
        <span style={{
          fontSize: 16, fontWeight: 700, color: '#C0D8C4',
          letterSpacing: '0.03em',
        }}>
          {t('rulesTitle')}
        </span>
        <div style={{ width: 56 }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 32px' }}>

        {/* Main rules sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '13px 15px',
              display: 'flex', gap: 13, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(94,204,134,0.1)',
                border: '1px solid rgba(94,204,134,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#5ECC86',
                flexShrink: 0, fontWeight: 700,
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#C0D8C4', marginBottom: 4 }}>
                  {s[lang].title}
                </div>
                <div style={{ fontSize: 12, color: '#5A7A60', lineHeight: 1.5 }}>
                  {s[lang].body}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div style={{
          fontSize: 11, fontWeight: 700, color: '#3A5A40',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 10,
        }}>
          {lang === 'ru' ? 'Отличия режимов' : lang === 'es' ? 'Diferencias' : 'Mode differences'}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          {DIFF_ROWS.map((row, i) => (
            <div key={i} style={{
              display: 'flex',
              borderBottom: i < DIFF_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              background: i === 0 ? 'rgba(94,204,134,0.05)' : 'transparent',
            }}>
              {row[lang].map((cell, j) => (
                <div key={j} style={{
                  flex: j === 0 ? '1.1' : '1',
                  padding: '10px 12px',
                  fontSize: i === 0 ? 10 : 12,
                  fontWeight: i === 0 ? 700 : j === 0 ? 600 : 400,
                  color: i === 0
                    ? '#3A6A48'
                    : j === 0 ? '#7A9A80' : j === 1 ? '#B0C8B4' : '#8AAAA8',
                  letterSpacing: i === 0 ? '0.06em' : 0,
                  textTransform: i === 0 ? 'uppercase' : 'none',
                  borderLeft: j > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
