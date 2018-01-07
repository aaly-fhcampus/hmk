from flask import Flask
from flask_bootstrap import Bootstrap
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://admin:admin@localhost/hmk'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
Bootstrap(app)
socketio = SocketIO(app)

from hmk import api

api.db.init_app(app)
app.app_context().push()
api.db.create_all(app=app)
api.db.session.commit()

app.register_blueprint(api.mod, url_prefix='/api')


@socketio.on('connect')
def test_connect():
    print('Client connected')


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

