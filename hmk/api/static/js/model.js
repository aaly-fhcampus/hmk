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