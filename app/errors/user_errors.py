class UserError(Exception):
    """Base user exception"""


class UserAlreadyExists(UserError):
    """User already exists"""


class EmailAlreadyExists(UserError):
    """Email already exists"""


class PhoneNumberExists(UserError):
    """Phone Number already exists"""


class WrongInfoInput(UserError):
    """Wrong Personal Info input"""
    def __init__(self,errors):
        self.errors = errors


class WrongPersonalInfoValidation(UserError):
    def __init__(self, errors: list[dict]):
        self.errors = errors


class UserNotFound(UserError):
    """User not found"""

class WrongCredentials(UserError):
    """Wrong login or password"""