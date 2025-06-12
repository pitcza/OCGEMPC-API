// const leven = require("leven"); disabled for now
// const { metaphone } = require("metaphone"); disabled for now

module.exports = {
  // For string comparison (names, addresses)
  stringSimilarity: (str1, str2) => {
    if (!str1 || !str2) return 0.5;

    // Basic equality
    if (str1.toLowerCase() === str2.toLowerCase()) return 1;

    // // Phonetic similarity
    // if (metaphone(str1) === metaphone(str2)) return 0.9; disabled for now

    // Normalized Levenshtein
    // const maxLen = Math.max(str1.length, str2.length);
    // return 1 - leven(str1, str2) / maxLen;

    return 0.6; //default return for now
  },

  // For numeric comparison (salary, amounts)
  numericSimilarity(num1, num2) {
    if (num1 == null || num2 == null) return 0;
    const diff = Math.abs(parseFloat(num1) - parseFloat(num2));
    const max = Math.max(parseFloat(num1), parseFloat(num2));
    return max > 0 ? 1 - diff / max : 0;
  },

  // For date comparison
  dateSimilarity(date1, date2) {
    if (!date1 || !date2) return 0;
    return date1 === date2 ? 1 : 0;
  },
};
