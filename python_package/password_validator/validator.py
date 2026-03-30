import re

COMMON_PASSWORDS = {
    'password', 'password123', '123456', '12345678', '123456789',
    'qwerty', 'iloveyou', 'admin', 'welcome', 'letmein', 'password1234'
}

class PasswordValidator:
    @staticmethod
    def evaluate(password: str) -> dict:
        if not isinstance(password, str) or len(password) < 8:
            return {'score': 0, 'is_valid': False, 'feedback': ['Password must be at least 8 characters long.']}
        
        score = 0
        feedback = []

        # 1. Common password check
        if password.lower() in COMMON_PASSWORDS:
            return {'score': 0, 'is_valid': False, 'feedback': ['This password is too common and easily guessed.']}

        # 2. Length check
        if len(password) >= 12:
            score += 1
        else:
            feedback.append('Increase password length to 12 or more characters for better security.')

        # 3. Character Diversity
        diversity = 0
        if re.search(r'[a-z]', password): diversity += 1
        if re.search(r'[A-Z]', password): diversity += 1
        if re.search(r'\d', password): diversity += 1
        if re.search(r'[^a-zA-Z0-9]', password): diversity += 1

        if diversity == 4:
            score += 2
        elif diversity == 3:
            score += 1
            feedback.append('Add special characters or a mix of cases/numbers to improve strength.')
        else:
            feedback.append('Use a mix of uppercase, lowercase, numbers, and symbols.')

        # 4. Pattern Checks (Repetition and Sequences)
        if re.search(r'(.)\1\1', password):
            score = max(0, score - 1)
            feedback.append('Avoid repeating characters more than twice consecutively.')

        seq_pattern = re.compile(
            r'abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|'
            r'123|234|345|456|567|678|789', 
            re.IGNORECASE
        )
        if seq_pattern.search(password):
            score = max(0, score - 1)
            feedback.append('Avoid common sequential character patterns.')

        if score >= 2:
            score += 1

        score = min(4, score)
        is_valid = score >= 3
        
        if is_valid and not feedback:
            feedback.append('Strong password!')

        return {
            'score': score,
            'is_valid': is_valid,
            'feedback': feedback
        }
