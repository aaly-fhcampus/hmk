from hmk.api import db

from .enums import DeckType, Color

from .cards import AchMeinDein, NotToDoList, Kommunismus, HaltMalKurz, Richtungswechsel, FarbeAendern, BlackClover, \
    Plus4, Plus2, Kapitalismus, Aussetzen, DasFinanzamt


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
            'cards': [card.serialize for card in self.cards],
            'deck_type': self.deck_type.value,
            'player_id': self.player_id
        }

    def create_draw_pile(self):
        if self.deck_type == DeckType.DRAW_PILE:
            cards = []
            for card_logic in self.logic():
                for i in range(0, card_logic[1]):
                    if card_logic[2]:
                        colors = list(Color.__members__)
                        colors.remove('ALL')
                        for color in colors:
                            card = card_logic[0](color=Color.__getattr__(color))
                            cards.append(card)
                    else:
                        card = card_logic[0]()
                        cards.append(card)
            return cards
        else:
            return

    def logic(self):
        return [
            (AchMeinDein, 2, False),
            (NotToDoList, 2, False),
            (Kommunismus, 2, False),
            (HaltMalKurz, 2, False),
            (Richtungswechsel, 4, True),
            (FarbeAendern, 4, False),
            (BlackClover, 1, False),
            (Plus4, 2, False),
            (Plus2, 4, True),
            (Kapitalismus, 2, False),
            (Aussetzen, 4, True),
            (DasFinanzamt, 2, False),
        ]
