from hmk.api import db


class Player(db.Model):
    __tablename__ = 'player'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    card_deck = db.relationship("CardDeck", backref='player', lazy=True)
    play_ground_id = db.Column(db.Integer, db.ForeignKey('play_ground.id'))

    def __init__(self, name, card_deck):
        self.name = name
        if card_deck:
            self.card_deck.append(card_deck)

    def __repr__(self):
        return '<id {}>'.format(self.id)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'card_deck': self.card_deck
        }
