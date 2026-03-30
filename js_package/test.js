const { evaluatePassword } = require('./index.js');

const tests = [
    { pwd: 'short', expectedScore: 0, expectedValid: false },
    { pwd: 'password', expectedScore: 0, expectedValid: false },
    { pwd: '123456789', expectedScore: 0, expectedValid: false }, // Common sequence
    { pwd: 'password123', expectedScore: 0, expectedValid: false },
    { pwd: 'MyPassw0rd!', expectedScore: 3, expectedValid: true }, // Len 11, 4 classes => score 1 (len) + 2 (div) = 3 -> boost -> 4 => sequence? No. score 4
    { pwd: 'AmazingP@ssw0rd99!', expectedScore: 4, expectedValid: true } // Len 18, 4 classes. No seq.
];

console.log("Running JS Password Validation Tests...");
tests.forEach((t, i) => {
    const res = evaluatePassword(t.pwd);
    const passed = res.score === t.expectedScore && res.isValid === t.expectedValid;
    console.log(`Test ${i + 1}: '${t.pwd}' - ${passed ? 'PASS' : 'FAIL'} (Expected ${t.expectedScore}, Got ${res.score})`);
    if (!passed) console.log(`   Feedback: ${res.feedback.join(' ')}`);
});
