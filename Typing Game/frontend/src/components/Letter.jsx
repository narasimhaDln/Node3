import { useGameContext } from "../context/GameContext";

export function Letter({ char, letterIdx, wordIdx }) {
  const { lettersClassNames } = useGameContext();

  return <span className={lettersClassNames[wordIdx][letterIdx]}>{char}</span>;
}

export default Letter;
