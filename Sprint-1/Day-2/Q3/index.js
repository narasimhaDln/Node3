const { checkPalindrome, countVowels } = require("../Q3/fun");

const randomWords = require("random-words");
const words = randomWords(5);
for (let i = 0; i < words.length; i++) {
  let word = words[i];
  let vowel = countVowels(word);
  let palindrome = checkPalindrome(word);
  console.log(
    `word ${
      i + 1
    } -> ${word} -> vowelsCount: ${vowel} -> isPalindrome: ${palindrome}`
  );
}
