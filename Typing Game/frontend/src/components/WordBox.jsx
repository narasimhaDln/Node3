import { useCallback, useEffect, useRef, useState } from "react";
import { useGameContext } from "../context/GameContext";
import Word from "./Word";
import Cursor from "./Cursor";
import { debounce } from "lodash";

export function WordBox() {
  const { currLetterIdx, currWordIdx, gameWords, wordsClassNames, isLoading } =
    useGameContext();
  const wordBoxRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });

  const updateScrollPosition = useCallback(() => {
    if (isLoading) return;

    if (wordBoxRef.current) {
      const currentWordElement = wordBoxRef.current.children[currWordIdx];
      currentWordElement.scrollIntoView({
        behavior: "instant",
        block: "nearest",
      });
    }
  }, [currWordIdx, isLoading]);

  const updateCursorPosition = useCallback(() => {
    if (wordBoxRef.current) {
      const currWordElement = wordBoxRef.current.children[currWordIdx];

      if (currWordElement) {
        const currLetterElement = currWordElement.children[currLetterIdx];
        const prevLetterElement = currWordElement.children[currLetterIdx - 1];

        if (currLetterElement) {
          const letterTop = currLetterElement.getBoundingClientRect().top + 2;
          const letterLeft = currLetterElement.getBoundingClientRect().left;
          setCursorPosition({ top: letterTop, left: letterLeft });
        } else {
          const prevLetterTop =
            prevLetterElement.getBoundingClientRect().top + 2;
          const wordRight = currWordElement.getBoundingClientRect().right;
          setCursorPosition({ top: prevLetterTop, left: wordRight });
        }
      }
    }
  }, [currLetterIdx, currWordIdx, isLoading]);

  const handleResize = debounce(() => {
    updateCursorPosition();
  }, 300);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      handleResize.cancel();
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    updateScrollPosition();
  }, [gameWords, wordsClassNames, currWordIdx, updateScrollPosition]);

  useEffect(() => {
    updateCursorPosition();
  }, [currLetterIdx, updateCursorPosition]);

  return (
    <>
      <Cursor top={cursorPosition.top} left={cursorPosition.left} />
      <div className="wordbox" ref={wordBoxRef}>
        {gameWords.map((word, idx) => (
          <Word key={idx} wordIdx={idx} />
        ))}
      </div>
    </>
  );
}

export default WordBox;
