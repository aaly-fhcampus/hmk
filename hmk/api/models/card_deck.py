from hmk.api import db

from .enums import DeckType


class CardDeck(db.Model):
    __tablename__ = 'card_deck'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    cards = db.relationship("Card", backref='card_deck', lazy=True)
    deck_type = db.Column(db.Enum(DeckType))
    player_id = db.Column(db.Integer, db.ForeignKey('player.id'))

    def __init__(self, name, cards, deck_type):
        self.name = name
        self.deck_type = deck_type
        self.cards.extend(cards)

    def __repr__(self):
        return '<id {}>'.format(self.id)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'cards': self.cards,
            'deck_type': self.deck_type,
            'player_id': self.player_id
        }