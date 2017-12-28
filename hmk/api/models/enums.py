# -*- coding: utf-8 -*-

from enum import Enum


class Category(Enum):
    FUNNY = 1
    NOT_FUNNY = 2
    NEUTRAL = 0


class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
    ALL = 10


class DeckType(Enum):
    PLAYER_DECK = 1
    DISCARD_DECK = 2
    DRAW_PILE = 3
