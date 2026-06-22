import { BoardView } from './BoardView';
import { GameHUD } from './GameHUD';

export function GameScreen() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', width: '100%',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(26,61,28,0.4) 0%, #050B06 60%)',
      paddingBottom: 16,
    }}>
      <GameHUD />
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <BoardView />
      </div>
    </div>
  );
}
