import { useGameContext } from "../context/GameContext";

export function Info() {
  const gameContext = useGameContext();
  const { timer, wpm } = gameContext;
  return (
    <div className="flex-container">
      {timer > 0 ? (
        <div className="info">{timer}</div>
      ) : (
        <div className="info">WPM: {wpm}</div>
      )}
    </div>
  );
}

export default Info;
