const COMMON_PASSWORDS = new Set([
    'password', 'password123', '123456', '12345678', '123456789',
    'qwerty', 'iloveyou', 'admin', 'welcome', 'letmein', 'password1234'
]);

function evaluatePassword(password) {
    if (typeof password !== 'string' || password.length === 0) {
        return { score: -1, isValid: false, feedback: ['Enter a password to see its strength.'] };
    }
    if (password.length < 8) {
        return { score: 0, isValid: false, feedback: ['Password must be at least 8 characters long.'] };
    }

    let score = 0;
    const feedback = [];

    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
        return { score: 0, isValid: false, feedback: ['This password is too common and easily guessed.'] };
    }

    if (password.length >= 12) {
        score += 1;
    } else {
        feedback.push('Increase password length to 12 or more characters for better security.');
    }

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

    if (/(.)\1\1/.test(password)) {
        score = Math.max(0, score - 1);
        feedback.push('Avoid repeating characters more than twice consecutively.');
    }

    const sequentialPattern = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789)/i;
    if (sequentialPattern.test(password)) {
        score = Math.max(0, score - 1);
        feedback.push('Avoid common sequential character patterns.');
    }

    if (score >= 2) score += 1;
    if (score > 4) score = 4;

    const isValid = score >= 3;
    if (isValid && feedback.length === 0) {
        feedback.push("Strong password! You're good to go.");
    }

    return { score, isValid, feedback };
}

document.addEventListener('DOMContentLoaded', () => {
    const pwdInput = document.getElementById('password');
    const toggleBtn = document.getElementById('toggle-visibility');
    const eyeIcon = document.getElementById('eye-icon');
    
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.getElementById('strength-text');
    const feedbackList = document.getElementById('feedback-list');

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

    toggleBtn.addEventListener('click', () => {
        const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
        pwdInput.setAttribute('type', type);
        
        if (type === 'text') {
            eyeIcon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`;
        } else {
            eyeIcon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
        }
    });

    pwdInput.addEventListener('input', (e) => {
        const val = e.target.value;
        const { score, feedback } = evaluatePassword(val);

        if (score === -1) {
            strengthMeter.className = 'strength-meter'; // reset
            strengthText.textContent = "Welcome";
            strengthText.className = "strength-text";
            strengthText.style.color = '#94a3b8';
            document.querySelectorAll('.bar').forEach(bar => bar.className = 'bar');
        } else {
            strengthMeter.className = `strength-meter score-${score}`;
            strengthText.textContent = labels[score];
            strengthText.className = `strength-text text-${score}`;
            
            // Bar animations handled heavily via css parent class, 
            // but we ensure clean sub-classes
            document.querySelectorAll('.bar').forEach((bar, idx) => {
                bar.className = 'bar'; // reset
                // Very weak = 1 red bar, Weak = 2 orange bars, etc.
                const barsActive = score === 0 ? 1 : (score === 3 ? 4 : score + 1);
                if (score === 4) barsActive = 4; // cap at 4

                if (idx < barsActive && score >= 0) {
                    bar.classList.add(`bar-${idx + 1}`);
                }
            });
        }

        // Render feedback
        feedbackList.innerHTML = feedback.map(f => `<li>${f}</li>`).join('');
    });
});
