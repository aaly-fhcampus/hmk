from hmk.api import db


class PlayGround(db.Model):
    __tablename__ = 'play_ground'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    players = db.relationship("Player", backref='play_ground', lazy=True)

    draw_pile_id = db.Column(db.Integer, db.ForeignKey('card_deck.id'), nullable=True)
    draw_pile = db.relationship('CardDeck', foreign_keys=[draw_pile_id], uselist=False)

    discard_pile_id = db.Column(db.Integer, db.ForeignKey('card_deck.id'), nullable=True)
    discard_pile = db.relationship('CardDeck', foreign_keys=[discard_pile_id], uselist=False)

    max_players = db.Column(db.Integer)

    def __init__(self, name, players, draw_pile, discard_pile, max_players):
        self.name = name
        if players:
            self.players.extend(players)
        if draw_pile:
            self.draw_pile = draw_pile
        if discard_pile:
            self.discard_pile = discard_pile
        self.max_players = max_players

    def __repr__(self):
        return '<id {}>'.format(self.id)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'players': self.players,
            'draw_pile': self.draw_pile if self.draw_pile else False,
            'discard_pile': self.discard_pile if self.discard_pile else False,
            'max_players': self.max_players
        }
