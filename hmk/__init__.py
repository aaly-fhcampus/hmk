from flask import Flask
from flask_bootstrap import Bootstrap
from flask_socketio import SocketIO, emit, send

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


@app.before_first_request
def setup():
    pass

@socketio.on('my event')
def test_message(message):
    print(message)
    print('These are connected: ' + str(socketio.server.environ.keys()))
    emit('response', {'data': 'got it!'})


@socketio.on('conntected')
def get_connected(message):
    print('These are connected: ' + str(socketio.server.environ.keys()))
    emit('response', {'data': {'connected': len(socketio.server.environ.keys())}})

