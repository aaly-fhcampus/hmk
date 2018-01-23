var PlayGround = Backbone.Model.extend({
    defaults: {
        name: '',
        players: [],
        draw_pile: null,
        discard_pile: null,
        max_players: null
    },
});

var PlayGroundCollection = Backbone.Collection.extend({
    model: PlayGround,
    url: '/api/playground'
});

var Card = Backbone.Model.extend({
    urlRoot: '/api/card',
    defaults: {
        id: null,
        name: '',
        category: null,
        color: null,
        uid: null,
        type: null,
    },
    initialize: function() {
        if (this.id) {
            this.fetch();
        }
    }
});

var CardCollection = Backbone.Collection.extend({
    model: Card
});

var CardDeck = Backbone.Model.extend({
    urlRoot: '/api/card_deck',
    defaults: {
        name: '',
        cards: new CardCollection(),
        deck_type: ''
    },
    initialize: function() {
        if (this.id) {
            this.fetch();
        }
    },
    parse: function(response) {
        response.cards = new CardCollection(response.cards);
        return response;
    }
});

var Message = Backbone.Model.extend({
    defaults: {
        title: 'Info',
        message: '',
        type: 'info'
    }
});

var Player = Backbone.Model.extend({
    urlRoot: '/api/player',
    defaults: {
        id: null,
        name: '',
        card_deck: new CardDeck(),
    },
    initialize: function() {
        if (this.id) {
            this.fetch();
        }
    },
    parse: function(response) {
        response.card_deck = new CardDeck(response.card_deck);
        return response;
    }
});

var PlayerCollection = Backbone.Collection.extend({
    model: Player
});

var DeckType = {
    1: 'PLAYER_DECK',
    2: 'DISCARD_DECK',
    3: 'DRAW_PILE'
};