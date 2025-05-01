function checkPalindrome(str) {
  let left = 0,
    right = str.length - 1;
  while (left <= right) {
    if (str[left] !== str[right]) {
      console.log("Not palindrome");
      return;
    }
    left++;
    right--;
  }
  console.log("Is Palindrome");
}
function countVowels(str) {
  let vowelCount = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (
      char === "a" ||
      char === "e" ||
      char === "i" ||
      char === "o" ||
      char === "u"
    ) {
      vowelCount++;
    }
  }
  console.log(vowelCount);
}
module.exports = { checkPalindrome, countVowels };
