from hmk.api import db

import uuid
import random
from .enums import Category, Color, DeckType
from sqlalchemy.ext.declarative import declared_attr


class Card(db.Model):
    __tablename__ = 'card'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    category = db.Column(db.Enum(Category))
    color = db.Column(db.Enum(Color))
    uid = db.Column(db.String)
    type = db.Column(db.String(32))

    @declared_attr
    def card_deck_id(self):
        return db.Column(db.Integer, db.ForeignKey('card_deck.id'))

    def __init__(self, name, category, color):
        self.name = name
        self.category = category
        self.color = color
        self.uid = uuid.uuid4().hex

    def __repr__(self):
        return '<id {}>'.format(self.id)

    __mapper_args__ = {
        'polymorphic_identity': __name__.lower(),
        'polymorphic_on': 'type'
    }

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'color': self.color,
            'uid': self.uid,
            'type': self.type
        }


class AchMeinDein(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'oh_my_yours'
    }

    def __init__(self, color=None):
        super(AchMeinDein, self).__init__('Ach mein Dein', Category.FUNNY,
                                          random.choice([Color.RED, Color.GREEN, Color.BLUE]) if not color else color)


class NotToDoList(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'not_to_do_list'
    }

    def __init__(self, color=None):
        super(NotToDoList, self).__init__('Not ToDo Liste', Category.FUNNY,
                                          random.choice([Color.RED, Color.GREEN, Color.BLUE]) if not color else color)


class Kommunismus(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'communism'
    }

    def __init__(self):
        super(Kommunismus, self).__init__('Kommunismus', Category.FUNNY, Color.ALL)


class HaltMalKurz(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'stop_for_a_moment'
    }

    def __init__(self, color=None):
        super(HaltMalKurz, self).__init__('Halt Mal Kurz', Category.FUNNY,
                                          random.choice([Color.RED, Color.GREEN, Color.BLUE]) if not color else color)


class Richtungswechsel(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'change_direction'
    }

    def __init__(self, color=None):
        super(Richtungswechsel, self).__init__('Richtungswechsel', Category.FUNNY,
                                               random.choice(
                                                   [Color.RED, Color.GREEN, Color.BLUE]) if not color else color)


class FarbeAendern(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'change_color'
    }

    def __init__(self):
        super(FarbeAendern, self).__init__('Farbe Ändern', Category.FUNNY, Color.ALL)


class BlackClover(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'black_clover'
    }

    def __init__(self):
        super(BlackClover, self).__init__('Black Clover', None, None)


class Plus4(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'plus4'
    }

    def __init__(self):
        super(Plus4, self).__init__('Plus 4', Category.NOT_FUNNY, Color.ALL)


class Plus2(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'plus2'
    }

    def __init__(self, color=None):
        super(Plus2, self).__init__('Plus 2', Category.NOT_FUNNY,
                                    random.choice([Color.RED, Color.GREEN, Color.BLUE]) if not color else color)


class Kapitalismus(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'capitalism'
    }

    def __init__(self, color=None):
        super(Kapitalismus, self).__init__('Kapitalismus', Category.NOT_FUNNY,
                                           random.choice([Color.RED, Color.GREEN, Color.BLUE]) if not color else color)


class Aussetzen(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'block'
    }

    def __init__(self, color=None):
        super(Aussetzen, self).__init__('Aussetzen', Category.NOT_FUNNY,
                                        random.choice([Color.RED, Color.GREEN, Color.BLUE]) if not color else color)


class DasFinanzamt(Card):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'the_tax_office'
    }

    def __init__(self, color=None):
        super(DasFinanzamt, self).__init__('Das Finanzamt', Category.NOT_FUNNY,
                                           random.choice([Color.RED, Color.GREEN, Color.BLUE]) if not color else color)
