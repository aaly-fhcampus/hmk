
var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function() {
    socket.emit('my event', {data: 'I\'m connected!'});
});

socket.on('response', function(data) {
    console.log(data.data);
});

$('input[name="login"]').on('click', function(){
    socket.emit('register_player', {name: $('input[name="name"]').val()});
});

socket.on('register_player', function(data) {
    console.log(data.data);
    $('.login').toggle('slow');
    init_lobby();
    $('.lobby').toggle('slow');
});


var PlayGround = Backbone.Model.extend({
    defaults: {
        name: '',
        players: [],
        draw_pile: null,
        discard_pile: null,
        max_players: null
    },
    action: function(){

    }
});

var PlayGroundCollection = Backbone.Collection.extend({
    model: PlayGround
});

var PlayGrounds = new PlayGroundCollection();

var PlayGroundView = Backbone.View.extend({
    tagName: 'tr',
    className : 'clickable',
    events: {
        'click': 'showMenu'
    },
    template: _.template($('#lobby-template').html()),
    initialize: function() {
        _.bindAll(this, 'render');
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    showMenu: function() {
        var itemColl = new ItemColl();
        new MenuView({collection: itemColl}); // how to pass the position of menu here?
    }
});

$("row").click(function(){
    //to navigate to another page
    location.href = 'user/student';//the other page's url
 });

function init_lobby() {

    var PlayGroundsView = Backbone.View.extend({

        el: '#table-body',

        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.html('');

            PlayGrounds.each(function(model) {
                var playground = new PlayGroundView({
                    model: model
                });

                this.$el.append(playground.render().el);
            }.bind(this));

            return this;
        }

    });

    $.ajax({
        url: "get_lobby",
        dataType: 'json'
    }).done(function(data) {
        console.log(data);
        PlayGrounds.add(data);
        var app = new PlayGroundsView();
    });


}

var CardDeck = Backbone.Model.extend({
    defaults: {
        name: '',
        cards: [],
        type: ''
    },
    action: function(){

    }
});

var player_card_deck = new CardDeck({
    name: 'Player1 Deck',
    cards: 'Whip',
    type: 'player_deck'
});


var CardDeckView = Backbone.View.extend({
    el: '#table-body',
    initialize: function() {
        this.render();
    },
    render: function() {
        this.$el.html('');

        return this;
    }
});

 $('#create_playground').on('click', function(){
    // Render an instance of your modal
    var modalView = new Modal();
    $('.playground-modal').html(modalView.render().el);
});

var Modal = Backbone.Modal.extend({
    template: '#modal-template',
    cancelEl: '.close-button',
    submitEl: '.create-button',
    events: {
          'click .create-button': 'create_playground'
        },
        create_playground: function(e) {
            e.preventDefault();
            socket.emit('create_playground', {name: $('input[name="playground_name"]').val()});
        }
});