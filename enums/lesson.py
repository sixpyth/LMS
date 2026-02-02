from enum import StrEnum

class LessonType(StrEnum):
    IELTS = "IELTS"
    GROUP = "GROUP"
    INDIVIDUAL = "INDIVIDUAL"
    TRIAL = "TRIAL"

class Format(StrEnum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"