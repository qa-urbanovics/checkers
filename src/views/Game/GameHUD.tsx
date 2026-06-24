import { useGameStore } from '../../store/gameStore';
import { useT } from '../../i18n';

export function GameHUD() {
  const { game, setScreen, resetGame, undoMove, offerDraw, acceptDraw, declineDraw, settings } = useGameStore();
  const { currentTurn, status, winner, gameMode, aiDifficulty, redPiecesCount, blackPiecesCount, boardSize, drawOffer } = game;
  const t = useT();
  const isTablet = window.innerWidth > 600;

  const isAI = gameMode === 'ai';
  const isClassic = settings.pieceTheme === 'classic';

  const diffShort = { easy: t('easyShort'), medium: t('mediumShort'), hard: t('hardShort') };

  const canUndo = game.stateHistory.length >= (isAI ? 2 : 1) && status !== 'finished';

  const statusText = () => {
    if (status === 'finished') {
      if (winner === 'red') return isAI ? t('youWin') : (isClassic ? t('whiteWins') : t('redWins'));
      if (winner === 'black') return isAI ? t('aiWin') : (isClassic ? t('blackWins') : t('greenWins'));
      return t('draw');
    }
    if (isAI && currentTurn === 'black') return t('aiThinking');
    return currentTurn === 'red'
      ? (isClassic ? t('whiteTurn') : t('redTurn'))
      : (isClassic ? t('blackTurn') : t('greenTurn'));
  };

  const statusColor = status === 'finished'
    ? (winner === 'red' ? '#C9A84C' : winner === 'black' ? '#E05A5A' : '#6A9A74')
    : currentTurn === 'red' ? '#E05A5A' : '#90B8A0';

  const p1Bg = isClassic ? '#EEEAE4' : '#C83232';
  const p1Border = isClassic ? 'rgba(150,120,80,0.28)' : 'rgba(255,170,170,0.22)';
  const p2Bg = isClassic ? '#1E1E1E' : '#1E6638';
  const p2Border = isClassic ? 'rgba(255,255,255,0.09)' : 'rgba(100,210,140,0.22)';

  const circleSize  = isTablet ? 52 : 36;
  const countSize   = isTablet ? 32 : 22;
  const labelSize   = isTablet ? 12 : 10;
  const statusSize  = isTablet ? 18 : 13;
  const hudPad      = isTablet ? '16px 24px 14px' : '10px 14px 10px';
  const cardPad     = isTablet ? '16px 24px' : '12px 16px';
  const cardRadius  = isTablet ? 22 : 18;
  const cardGap     = isTablet ? 16 : 12;
  const infoSize    = isTablet ? 13 : 11;

  return (
    <div style={{ padding: hudPad }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isTablet ? 14 : 10 }}>
        <button onClick={() => setScreen('home')} style={navBtnStyle('#5ECC86', 'rgba(94,204,134,0.07)', 'rgba(94,204,134,0.15)', isTablet)}>
          {t('menu')}
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: infoSize, color: '#3A5A40', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {boardSize}×{boardSize} · {isAI ? `${t('ai')} ${diffShort[aiDifficulty]}` : '1 vs 1'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: isTablet ? 10 : 6 }}>
          <button
            onClick={undoMove}
            disabled={!canUndo}
            style={navBtnStyle(
              canUndo ? '#C9A84C' : '#3A4A38',
              'rgba(255,255,255,0.04)',
              canUndo ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
              isTablet
            )}
            title={t('undo')}
          >
            ↩
          </button>
          {status === 'playing' && (
            <button
              onClick={offerDraw}
              style={navBtnStyle('#6A9A74', 'rgba(255,255,255,0.04)', 'rgba(106,154,116,0.25)', isTablet)}
              title={t('offerDraw')}
            >
              ½
            </button>
          )}
          <button onClick={resetGame} style={navBtnStyle('#6A8A70', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.09)', isTablet)}>
            ↺
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: cardRadius, padding: cardPad, gap: cardGap,
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: isTablet ? 14 : 10 }}>
          <div style={{
            width: circleSize, height: circleSize, borderRadius: '50%',
            background: p1Bg, border: `2px solid ${p1Border}`,
            boxShadow: currentTurn === 'red' && status === 'playing'
              ? '0 0 0 3px #5ECC86, 0 0 18px rgba(94,204,134,0.5)'
              : '0 3px 10px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.3s ease', flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: labelSize, color: '#3A5A40', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isAI ? t('you') : t('player1')}
            </div>
            <div style={{ fontSize: countSize, fontWeight: 800, color: '#E0EDE1', lineHeight: 1.1 }}>{redPiecesCount}</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', flex: 1.2 }}>
          <div style={{ fontSize: statusSize, fontWeight: 700, color: statusColor, lineHeight: 1.3, transition: 'color 0.3s ease' }}>
            {statusText()}
          </div>
          {status === 'playing' && (
            <div style={{
              width: isTablet ? 48 : 36, height: isTablet ? 4 : 3, borderRadius: 2, margin: '6px auto 0',
              background: currentTurn === 'red'
                ? 'linear-gradient(90deg, #C62828, #FF7070)'
                : 'linear-gradient(90deg, #1A3D2C, #5ECC86)',
              transition: 'background 0.4s ease',
            }} />
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: isTablet ? 14 : 10, justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: labelSize, color: '#3A5A40', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isAI ? t('ai') : t('player2')}
            </div>
            <div style={{ fontSize: countSize, fontWeight: 800, color: '#E0EDE1', lineHeight: 1.1 }}>{blackPiecesCount}</div>
          </div>
          <div style={{
            width: circleSize, height: circleSize, borderRadius: '50%',
            background: p2Bg, border: `2px solid ${p2Border}`,
            boxShadow: currentTurn === 'black' && status === 'playing'
              ? '0 0 0 3px #5ECC86, 0 0 18px rgba(94,204,134,0.4)'
              : '0 3px 10px rgba(0,0,0,0.6)',
            transition: 'box-shadow 0.3s ease', flexShrink: 0,
          }} />
        </div>
      </div>

      {drawOffer && status === 'playing' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 28px', backdropFilter: 'blur(8px)',
          animation: 'fadeUp 0.2s ease-out',
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #0A150B 0%, #0F1F12 50%, #0A150B 100%)',
            border: '1px solid rgba(94,204,134,0.2)', borderRadius: 28,
            padding: '32px 28px', textAlign: 'center', width: '100%', maxWidth: 320,
            boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
            animation: 'modalIn 0.3s cubic-bezier(0.175,0.885,0.32,1.2)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12, lineHeight: 1 }}>🤝</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', color: '#C0D8C4' }}>
              {isAI
                ? t('aiDeclinedDraw')
                : (currentTurn === 'red'
                    ? (isClassic ? t('drawOfferedToBlack') : t('drawOfferedToGreen'))
                    : (isClassic ? t('drawOfferedToWhite') : t('drawOfferedToRed')))}
            </h2>
            <p style={{ fontSize: 13, color: '#3A5A40', margin: '0 0 24px', fontWeight: 500 }}>
              {isAI ? t('aiDeclinedDrawSub') : t('drawOfferSub')}
            </p>
            {!isAI && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-outline" style={{ flex: 1 }} onClick={declineDraw}>
                  {t('decline')}
                </button>
                <button className="btn-gold" style={{ flex: 1 }} onClick={acceptDraw}>
                  {t('accept')}
                </button>
              </div>
            )}
            {isAI && (
              <button className="btn-outline" style={{ width: '100%' }} onClick={declineDraw}>
                {t('ok')}
              </button>
            )}
          </div>
        </div>
      )}

      {status === 'finished' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 28px', backdropFilter: 'blur(8px)',
          animation: 'fadeUp 0.2s ease-out',
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #0A150B 0%, #0F1F12 50%, #0A150B 100%)',
            border: '1px solid rgba(94,204,134,0.2)', borderRadius: 28,
            padding: '36px 28px', textAlign: 'center', width: '100%', maxWidth: 320,
            boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
            animation: 'modalIn 0.3s cubic-bezier(0.175,0.885,0.32,1.2)',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>
              {winner === 'red' ? '🏆' : winner === 'black' ? (isAI ? '🤖' : '🏆') : '🤝'}
            </div>
            <h2 style={{
              fontSize: 24, fontWeight: 800, margin: '0 0 8px',
              background: winner === 'red'
                ? 'linear-gradient(135deg, #FFD700, #C9A84C)'
                : winner === 'black'
                ? 'linear-gradient(135deg, #5ECC86, #3A9E62)'
                : 'linear-gradient(135deg, #A0B8A4, #6A8A70)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {statusText()}
            </h2>
            <p style={{ fontSize: 13, color: '#3A5A40', margin: '0 0 28px', fontWeight: 500 }}>
              {t('movesMade')} {game.turnCount}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setScreen('home')}>
                {t('menu').replace('← ', '')}
              </button>
              <button className="btn-gold" style={{ flex: 1 }} onClick={resetGame}>
                {t('playAgain')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function navBtnStyle(color: string, bg: string, border: string, tablet = false): React.CSSProperties {
  return {
    background: bg, border: `1px solid ${border}`,
    borderRadius: tablet ? 14 : 10,
    padding: tablet ? '10px 20px' : '7px 14px',
    color, fontSize: tablet ? 16 : 13,
    cursor: 'pointer', fontWeight: 600,
  };
}
