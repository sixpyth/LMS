class PasswordError(Exception):
    """Password errors"""


class WrongPasswordValidation(PasswordError):
    def __init__(self, errors: list[dict]):
        self.errors = errors


class WrongPasswordInput(PasswordError):
    """Password hasn't passed validation error"""

    def __init__(self, errors):
        self.errors = errors


class PasswordLength(PasswordError):
    """Password length is not valid error"""


class NoLettersInPassword(PasswordError):
    """Password doesn't include letters error"""


class NoPasswordFound(PasswordError):
    """Current user hasn't created unique password yet error"""


class PasswordsNotMatch(PasswordError):
    """Passwords do not match error"""


class PasswordAlreadyExists(PasswordError):
    """Password is already used by user"""
