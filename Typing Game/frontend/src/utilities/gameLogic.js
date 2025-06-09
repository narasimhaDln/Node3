/**
 * Calculate the words per minute (WPM).
 * @param {number} lastWordIdx - The index of the last word the player was on.
 * @param {string[]} wordsStatuses - An array containing the className of each game word representing each word as correct/incorrect.
 * @param {number} startTime - The starting time for the game in seconds.
 * @returns {number} The calculated WPM.
 */
export function calculateWPM(lastWordIdx, wordsStatuses, startTime) {
  let correctWords = 0;
  const gameMinutes = startTime / 60;

  for (let wordIdx = 0; wordIdx < lastWordIdx; wordIdx++) {
    if (wordsStatuses[wordIdx] !== "word incorrect") {
      correctWords++;
    }
  }

  const wpm = correctWords / gameMinutes;
  return wpm;
}
