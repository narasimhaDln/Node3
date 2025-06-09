import { useCallback, useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { wordsGenerator } from "../utilities/wordsGenerator";
import { calculateWPM } from "../utilities/gameLogic";
import { saveScore } from "../services/scoreService";

export const GameContext = createContext({});

export function useGameContext() {
  return useContext(GameContext);
}

// PROVIDES CONTEXT TO COMPONENTS
export function GameContextProvider({ children }) {
  const startingTime = 15; // seconds
  const numWords = 400;
  const difficulty = "easy";

  const [gameWords, setGameWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState(startingTime);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [currLetterIdx, setCurrLetterIdx] = useState(0);
  const [currWordIdx, setCurrWordIdx] = useState(0);
  const [lettersClassNames, setLettersClassNames] = useState([]);
  const [wordsDisplayTexts, setWordsDisplayTexts] = useState([]);
  const [wordsClassNames, setWordsClassNames] = useState([]);
  const [wpm, setWPM] = useState(0);

  // Set/reset game to initial state values
  const fetchWordsAndInitialize = async () => {
    setIsLoading(true);
    try {
      const newWords = await wordsGenerator(numWords, difficulty);
      setGameWords(newWords);
      setWordsClassNames(new Array(newWords.length).fill("word"));
      setWordsDisplayTexts(newWords);
      setLettersClassNames(
        newWords.map((word) => new Array(word.length).fill("letter"))
      );

      setIsLoading(false);
      setTimer(startingTime);
      setGameStarted(false);
      setGameFinished(false);
      setCurrWordIdx(0);
      setCurrLetterIdx(0);
    } catch (error) {
      console.error("Error fetching words:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWordsAndInitialize();
  }, []);

  const handleKeyPress = useCallback(
    (ev) => {
      const key = ev.key;
      const ctrlPressed = ev.ctrlKey;
      const isLetter = key.length === 1 && key.match(/[a-z]/i);
      const isSpace = key === " ";
      const isBackspace = key === "Backspace";

      if (gameFinished) {
        return;
      } else if (!gameStarted && isLetter) {
        startGame();
      }

      if (isLetter) {
        handleLetterKey(key);
      } else if (isSpace) {
        handleSpacebarKey();
      } else if (isBackspace) {
        handleBackspaceKey(ctrlPressed);
      }
    },
    [gameFinished, gameStarted, currWordIdx, currLetterIdx, gameWords]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    let interval = null;

    if (gameStarted) {
      if (timer > 0) {
        interval = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
      } else {
        stopGame();
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameStarted, timer]);

  const checkAndUpdateWordClassNames = () => {
    let isWordCorrect = true;

    for (let i = 0; i < lettersClassNames[currWordIdx].length; i++) {
      if (lettersClassNames[currWordIdx][i] !== "letter correct") {
        isWordCorrect = false;
        break;
      }
    }

    const newWordsClassNames = [...wordsClassNames];
    newWordsClassNames[currWordIdx] = isWordCorrect ? "word" : "word incorrect";
    setWordsClassNames(newWordsClassNames);
  };

  const handleLetterKey = (key) => {
    const currWord = gameWords[currWordIdx];
    let newLettersClassNames = [...lettersClassNames];
    let newDisplayTexts = [...wordsDisplayTexts];

    if (key === currWord[currLetterIdx]) {
      newLettersClassNames[currWordIdx][currLetterIdx] = "letter correct";
    } else if (currLetterIdx >= currWord.length) {
      newDisplayTexts[currWordIdx] = newDisplayTexts[currWordIdx] + key;
      newLettersClassNames[currWordIdx].push("letter incorrect extra");
    } else {
      newLettersClassNames[currWordIdx][currLetterIdx] = "letter incorrect";
    }

    setWordsDisplayTexts(newDisplayTexts);
    setLettersClassNames(newLettersClassNames);
    setCurrLetterIdx((prevIdx) => prevIdx + 1);
  };

  const handleSpacebarKey = () => {
    if (currLetterIdx === 0) {
      return;
    }

    const currWord = gameWords[currWordIdx];
    let newLettersClassNames = [...lettersClassNames];

    if (currLetterIdx < currWord.length) {
      for (let i = currLetterIdx; i < currWord.length; i++) {
        newLettersClassNames[currWordIdx][i] = "letter incorrect";
      }
    }

    setLettersClassNames(newLettersClassNames);
    checkAndUpdateWordClassNames();
    setCurrWordIdx(currWordIdx + 1);
    setCurrLetterIdx(0);
  };

  const handleBackspaceKey = (ctrlPressed) => {
    if (currLetterIdx === 0) {
      return;
    }

    const currWord = gameWords[currWordIdx];
    const currDisplayTextLength = wordsDisplayTexts[currWordIdx].length;
    let newLettersClassNames = [...lettersClassNames];
    let newDisplayTexts = [...wordsDisplayTexts];
    let newLetterIdx = currLetterIdx;

    if (ctrlPressed) {
      // Reset current word and move to first letter index
      newDisplayTexts[currWordIdx] = currWord;
      newLettersClassNames[currWordIdx] = new Array(currWord.length).fill(
        "letter"
      );
      newLetterIdx = 0;
    } else if (currDisplayTextLength !== currWord.length) {
      newDisplayTexts[currWordIdx] = newDisplayTexts[currWordIdx].substring(
        0,
        currDisplayTextLength - 1
      );
      newLettersClassNames[currWordIdx].pop();
      newLetterIdx -= 1;
    } else {
      newLettersClassNames[currWordIdx][currLetterIdx - 1] = "letter";
      newLetterIdx -= 1;
    }

    setWordsDisplayTexts(newDisplayTexts);
    setLettersClassNames(newLettersClassNames);
    setCurrLetterIdx(newLetterIdx);
  };

  const startGame = () => {
    setGameStarted(true);
    setTimer(startingTime);
  };

  const stopGame = async () => {
    const score = calculateWPM(currWordIdx, wordsClassNames, startingTime);
    setWPM(score);
    await saveScore("testUser", score);
    setGameFinished(true);
  };

  return (
    <GameContext.Provider
      value={{
        currLetterIdx,
        currWordIdx,
        gameWords,
        gameStarted,
        gameFinished,
        isLoading,
        startingTime,
        timer,
        wordsClassNames,
        lettersClassNames,
        wordsDisplayTexts,
        wpm,
        fetchWordsAndInitialize,
        startGame,
        stopGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export default GameContext;
