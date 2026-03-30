const COMMON_PASSWORDS = new Set([
  'password', 'password123', '123456', '12345678', '123456789',
  'qwerty', 'iloveyou', 'admin', 'welcome', 'letmein', 'password1234'
]);

function evaluatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return { score: 0, isValid: false, feedback: ['Password must be at least 8 characters long.'] };
  }

  let score = 0;
  const feedback = [];

  // 1. Common password check
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return { score: 0, isValid: false, feedback: ['This password is too common and easily guessed.'] };
  }

  // 2. Length check
  if (password.length >= 12) {
    score += 1;
  } else {
    feedback.push('Increase password length to 12 or more characters for better security.');
  }

  // 3. Character Diversity
  let diversityCount = 0;
  if (/[a-z]/.test(password)) diversityCount++;
  if (/[A-Z]/.test(password)) diversityCount++;
  if (/[0-9]/.test(password)) diversityCount++;
  if (/[^a-zA-Z0-9]/.test(password)) diversityCount++;

  if (diversityCount === 4) {
    score += 2;
  } else if (diversityCount === 3) {
    score += 1;
    feedback.push('Add special characters or a mix of cases/numbers to improve strength.');
  } else {
    feedback.push('Use a mix of uppercase, lowercase, numbers, and symbols.');
  }

  // 4. Pattern Checks (Repetition and Sequences)
  if (/(.)\1\1/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid repeating characters more than twice consecutively.');
  }

  const sequentialPattern = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789)/i;
  if (sequentialPattern.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid common sequential character patterns.');
  }

  if (score >= 2) {
      score += 1; // boost score if initial criteria are met without heavy penalties
  }
  
  if (score > 4) score = 4;

  const isValid = score >= 3;
  if (isValid && feedback.length === 0) {
      feedback.push("Strong password!");
  }

  return { score, isValid, feedback };
}

module.exports = { evaluatePassword, COMMON_PASSWORDS };
