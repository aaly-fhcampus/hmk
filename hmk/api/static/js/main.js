
var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function() {
    socket.emit('my event', {data: 'I\'m connected!'});
});

socket.on('register_player', function(data) {
    console.log(data.data);
    $('.login').toggle('slow');
    init_lobby();
    $('.lobby').toggle('slow');
});

var app = {};

app.login = new LoginView();
app.playground_buttons = new PlayGroundButtons();

function init_lobby() {
    app.playground_view = new PlayGroundsView();
}

//var CardDeck = Backbone.Model.extend({
//    defaults: {
//        name: '',
//        cards: [],
//        type: ''
//    },
//    action: function(){
//
//    }
//});
//
//var player_card_deck = new CardDeck({
//    name: 'Player1 Deck',
//    cards: 'Whip',
//    type: 'player_deck'
//});
//
//
//var CardDeckView = Backbone.View.extend({
//    el: '#table-body',
//    initialize: function() {
//        this.render();
//    },
//    render: function() {
//        this.$el.html('');
//
//        return this;
//    }
//});

