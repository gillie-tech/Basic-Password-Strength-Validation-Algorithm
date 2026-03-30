import unittest
from password_validator import PasswordValidator

class TestPasswordValidator(unittest.TestCase):
    def test_evaluator(self):
        tests = [
            ('short', 0, False),
            ('password', 0, False),
            ('123456789', 0, False),
            ('password123', 0, False),
            ('MyPassw0rd!', 3, True),
            ('AmazingP@ssw0rd99!', 4, True)
        ]
        
        for p, score, validity in tests:
            res = PasswordValidator.evaluate(p)
            self.assertEqual(res['score'], score, f"Failed score for {p}")
            self.assertEqual(res['is_valid'], validity, f"Failed validity for {p}")

if __name__ == '__main__':
    unittest.main()
