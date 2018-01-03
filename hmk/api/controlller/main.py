from flask import render_template, jsonify, request

from hmk.api import mod
from hmk.api.models.play_ground import PlayGround
from hmk.api.models.card_deck import CardDeck
from hmk.api.models.cards import Card
from hmk.api import db


@mod.route("/")
def index():
    return render_template("index.html")


@mod.route("/playgrounds", methods=['GET'])
def get_playgrounds():
    if request.args.get('name'):
        playgrounds = PlayGround.query.filter(PlayGround.name.like(request.args.get('name')))
    else:
        playgrounds = PlayGround.query.all()
    playground_list = []
    for playground in playgrounds:
        playground_list.append(playground.serialize)
    return jsonify(playground_list)


@mod.route("/card_deck/<card_deck_id>", methods=['GET'])
def get_card_deck(card_deck_id):
    card_deck = CardDeck.query.get(card_deck_id)

    return jsonify(card_deck.serialize)


@mod.route("/card/<card_id>", methods=['GET'])
def get_card(card_id):
    card = Card.query.get(card_id)

    return jsonify(card.serialize)
