export async function wordsGenerator(length, difficulty) {
  if (!length || !difficulty) {
    throw new Error("Invalid length or difficulty");
  }

  try {
    const response = await fetch("../data/wordlist.json");
    if (!response.ok) {
      throw new Error(
        "Network response was not ok while attempting to fetch wordsList."
      );
    }

    const wordsArray = await response.json();

    const difficultyMapping = new Map([
      ["easy", 5],
      ["medium", 10],
      ["hard", 15],
    ]);

    const difficultyValue = difficultyMapping.get(difficulty);
    const minWordLength =
      difficultyValue !== undefined ? difficultyValue - 5 : 0;
    const maxWordLength = difficultyValue || 10;

    const filteredWordsArray = wordsArray.filter(
      (word) => minWordLength <= word.length && word.length <= maxWordLength
    );

    length = Math.min(filteredWordsArray.length, length);

    const result = [];
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * filteredWordsArray.length);
      result.push(filteredWordsArray[randomIndex]);
      filteredWordsArray.splice(randomIndex, 1); // Prevent duplicates
    }

    return result;
  } catch (error) {
    console.error("Error fetching or processing words:", error);
    throw error;
  }
}
