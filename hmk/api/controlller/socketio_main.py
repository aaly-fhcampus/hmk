from hmk.api.models.cards import AchMeinDein, NotToDoList
from hmk.api.models.card_deck import CardDeck
from hmk.api.models.player import Player
from hmk.api.models.play_ground import PlayGround
from hmk.api.models.enums import DeckType

from flask_socketio import emit, send
from hmk import socketio
from hmk.api import db


@socketio.on('register_player')
def register_player(data):
    player = Player(data.get('name'), card_deck=None)
    db.session.add_all([player])
    db.session.commit()
    emit('register_player', {'data': player.serialize})


@socketio.on('create_playground')
def create_playground(data):
    draw_pile = CardDeck("DRAW PILE", [], DeckType.DRAW_PILE)
    cards = draw_pile.create_draw_pile()
    draw_pile.cards = cards
    discard_pile = CardDeck("DISCARD PILE", [], DeckType.DISCARD_DECK)

    playground = PlayGround(data.get('name'), None, draw_pile, discard_pile, 5)
    db.session.add_all([playground, draw_pile, discard_pile])
    db.session.add_all(cards)
    db.session.commit()
    emit('create_playground', {'data': playground.serialize})
    

