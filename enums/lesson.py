from enum import StrEnum


class LessonType(StrEnum):
    IELTS = "IELTS"
    GENERAL = "GENERAL"
    INTENSIVE = "INTENSIVE"
    TRIAL = "TRIAL"


class Grouping(StrEnum):
    GROUP = "GROUP"
    INDIVIDUEL = "INDIVIDUAL"


class Format(StrEnum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"
