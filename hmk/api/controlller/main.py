from flask import render_template, jsonify

from hmk.api import mod
from hmk.api.models.play_ground import PlayGround
from hmk.api import db


@mod.route("/")
def index():
    return render_template("index.html")


@mod.route("/get_lobby", methods=['GET'])
def get_lobby():
    playgrounds = PlayGround.query.all()
    playground_list = []
    for playground in playgrounds:
        playground_list.append(playground.serialize)
    return jsonify(playground_list)
