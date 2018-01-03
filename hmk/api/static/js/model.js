var PlayGround = Backbone.Model.extend({
    defaults: {
        name: '',
        players: [],
        draw_pile: null,
        discard_pile: null,
        max_players: null
    },
    init_decks: function() {
        var discard_pile = new CardDeck({id:this.attributes.discard_pile});
        discard_pile.fetch();
        this.attributes.discard_pile = discard_pile;

        var draw_pile = new CardDeck({id:this.attributes.draw_pile});
        draw_pile.fetch();
        this.attributes.draw_pile = draw_pile;

    }
});

var PlayGroundCollection = Backbone.Collection.extend({
    model: PlayGround,
    url: '/api/playgrounds'
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
        type: ''
    },
    initialize: function() {
        this.fetch();
    },
    parse: function(response) {
        response.cards = new CardCollection(response.cards);
        return response;
    }
});
