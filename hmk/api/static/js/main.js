
var app = {};
app.login = new LoginView();
app.playground_buttons = new PlayGroundButtons();

var socket = io.connect('http://' + document.domain + ':' + location.port+ '/');
socket.on('connect', function() {
    console.log('I\'m connected!');
});

socket.on('register_player', function(data) {
    app.player = data.data;
    console.log(data.data);
    $('.login').toggle('slow');
    init_lobby();
    $('.lobby').toggle('slow');
});

socket.on('message', function (data) {
    console.log(data);
});

socket.on('join_playground', function(data) {
    var joined = data.joined;
    var message = data.message;
    var playground_id = data.playground_id;

    if (joined) {
        //join the Game
        $('.lobby').toggle('slow');
        app.game_view = new GameView(playground_id);
    } else {
        new MessageModal({
            model: new Message({title: 'Warning', message: message, type: 'warning'})
        });
    }
});

socket.on('create_playground', function(data) {
    app.playground_view.playGrounds.add(data.data);
});

function init_lobby() {
    app.playground_view = new PlayGroundsView();
}
