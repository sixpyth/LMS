
from app.errors.user_errors import WrongPersonalInfoValidation
from app.core.constants.constants import MIN_NUMBER, MAX_NUMBER
import string

letters = string.ascii_letters  
print(letters)


def validate_info(name: str, surname: str, phone: str) -> bool:
    errors: list[dict] = []

    # Name validator
    if len(name) > MAX_NUMBER:
        errors.append({
            "field": "name",
            "message": "Длина имени превышает лимит",
            "invalid_values": []
        })
    
    elif len(name) < MIN_NUMBER:
        errors.append({
            "field": "name",
            "message": "Имя должно состоять минимум из двух букв",
            "invalid_values": []
        })
    
    invalid_name = [ch for ch in name if ch.isdigit()]

    if invalid_name:
        errors.append({
            "field": "name",
            "message": "Имя не может содержать цифры",
            "invalid_values": invalid_name,
        })
        
    # Surname validator
    if len(surname) > MAX_NUMBER:
        errors.append({
            "field": "surname",
            "message": "Длина фамилии превышает лимит",
            "invalid_values": []
        })
    
    elif len(surname) < MIN_NUMBER:
        errors.append({
            "field": "surname",
            "message": "Фамилия должна состоять минимум из двух букв",
            "invalid_values": []
        })

    invalid_surname = [ch for ch in surname if ch.isdigit()]

    if invalid_surname:
        errors.append({
            "field": "surname",
            "message": "Фамилия не может содержать цифры",
            "invalid_values": invalid_surname,
        })

    # Phone validator
    if len(phone) > 12:
        errors.append({
            "field": "phone",
            "message": f"Номер превышает длину: {len(phone)} символов",
            "invalid_values": []
        })

    if len(phone)<11:
        errors.append({
            "field": "phone",
            "message": f"Номер не должен быть меньше 11 символов",
            "invalid_values": []
        })

    invalid_letters = [ch for ch in phone if ch.isalpha()]
    
    
    if not phone.isdigit():
        errors.append({
            "field": "phone",
            "message": "Номер телефона должен содержать только цифры",
            "invalid_values": invalid_letters
        })

    if errors:
        raise WrongPersonalInfoValidation(errors=errors)

     
    return True