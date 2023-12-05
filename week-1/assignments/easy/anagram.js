/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.
*/

function isAnagram(str1, str2) {
  let hash = {};

  if (str1.length !== str2.length) return false;
  for (let char of str1) {
    let s = char.toLowerCase();
    if (hash[s]) hash[s]++;
    else hash[s] = 1;
  }
  console.log(hash, str1, str2);
  for (let char of str2) {
    let s = char.toLowerCase();
    if (hash[s]) hash[s]--;
    else return false;
  }
  return true;
}

module.exports = isAnagram;
