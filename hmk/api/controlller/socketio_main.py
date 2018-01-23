from hmk.api.models.cards import AchMeinDein, NotToDoList
from hmk.api.models.card_deck import CardDeck
from hmk.api.models.player import Player
from hmk.api.models.play_ground import PlayGround
from hmk.api.models.enums import DeckType

from flask_socketio import emit, send, join_room, leave_room
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


@socketio.on('join_playground')
def on_join(data):
    player = data['player']
    room = data['room']
    player = Player.query.get(int(player.get('player_id', False)))
    playground_id = int(room.replace('playground_', ''))
    playground = PlayGround.query.get(playground_id)
    if len(playground.players) == playground.max_players:
        emit('join_playground', {'joined': False, 'message': 'This Playground is already full'})
        return True
    playground.players.append(player)
    db.session.add(playground)
    db.session.commit()
    join_room(room)
    emit('join_playground', {'joined': True, 'message': 'You joind the playground', 'playground_id': playground_id},
         room=room)
    send(player.name + ' has entered the room.', room=room)
    return True


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)
