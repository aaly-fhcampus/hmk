var LoginView = Backbone.View.extend({
    el: '#main_content',
    events: {
        'click .login input[name="login"]': 'login',
        'keyup .login input[name="name"]': 'login'
    },
    template: _.template($('#login-template').html()),
    initialize: function() {
        this.render();
    },
    render: function() {
        this.$el.append(this.template());
        $('.login input[name="name"]').focus();
        return this;
    },
    login: function(e) {
        if (e.type == 'click' || (e.type == 'keyup' && e.keyCode == 13)) {
           socket.emit('register_player', {name: $('input[name="name"]').val()});
        }
    }
});

var PlayGroundView = Backbone.View.extend({
    tagName: 'tr',
    className : 'clickable',
    events: {
        'click': 'open_game'
    },
    template: _.template($('#lobby-template').html()),
    initialize: function() {
        _.bindAll(this, 'render');
    },
    render: function() {
        this.model.attributes.playground_player = ""+this.model.attributes.players.length+" / "+this.model.attributes.max_players;
        this.$el.html(this.template(this.model.attributes));
        this.$el.data( "playground", { id: this.model.attributes.id} );
        return this;
    },
    open_game: function(e) {
        socket.emit('join_playground', {room: 'playground_'+$(e.currentTarget).data('playground').id, player: {player_id: app.player.id, player_name:app.player.name}});
    }
});

var PlayGroundsView = Backbone.View.extend({

    el: '#table-body',
    playGrounds: undefined,

    initialize: function() {
        this.playGrounds = new PlayGroundCollection();
        this.playGrounds.fetch();
        this.render();

        this.playGrounds.on("add", this.render, this);
        this.playGrounds.on("remove", this.render, this);
        this.playGrounds.on("reset", this.render, this);
    },
    reload: function(){
        this.playGrounds.reset();
        this.playGrounds.fetch();
    },
    render: function() {
        this.$el.html('');

        this.playGrounds.each(function(model) {
            var playground = new PlayGroundView({
                model: model
            });

            this.$el.append(playground.render().el);
        }.bind(this));

        return this;
    },
    show: function() {
        this.$el.show();
    },
    hide: function() {
        this.$el.hide();
    }
});

var CreatePlaygroundModal = Backbone.Modal.extend({
    template: '#create_playground-template',
    cancelEl: '.close-button',
    submitEl: '.create-button',
    events: {
      'click .create-button': 'create_playground'
    },
    create_playground: function(e) {
        e.preventDefault();
        socket.emit('create_playground', {name: $('input[name="playground_name"]').val()});
        app.playground_buttons.refresh_playgrounds();
    }
});

var PlayGroundButtons = Backbone.View.extend({
    el: '#playground_buttons',

    events: {
        'click #create_playground': 'create_playground',
        'click #refresh_playgrounds': 'refresh_playgrounds',
        'click #search_playgrounds': 'search_playground',
        'keyup #search_ground_name': 'search_playground',
    },
    initialize: function() {
        this.render();
    },
    render: function() {
        return this;
    },
    create_playground: function() {
        var modalView = new CreatePlaygroundModal();
        $('.playground-modal').html(modalView.render().el);
    },
    refresh_playgrounds: function() {
        app.playground_view.reload();
    },
    search_playground: function(e) {
        if (e.type == 'click' || (e.type == 'keyup' && e.keyCode == 13)) {
            var search_value = $('input[name="search_ground_name"]').val();
            var foundModels = app.playground_view.playGrounds.fetch({ data: { name: search_value} });
        }
    }
});

var GameView = Backbone.View.extend({
    el : '.main-content',
    events: {

    },
    template: _.template($('#game-template').html()),
    initialize: function(playground_id) {
        this.playground_id = playground_id;
        // get Players
        playground = app.playground_view.playGrounds.get(playground_id);
        this.playersView = new PlayersView(playground.get('players'));
        this.discardPileView = new PileView({model:new CardDeck({id:playground.get('discard_pile')})});
        this.drawPileView = new PileView({model:new CardDeck({id:playground.get('draw_pile')})});
        this.render();
        this.toggle();
    },
    render: function() {
        this.$el.append(this.template());
        this.$el.find('.middle').append(this.playersView.el);
        this.$el.find('.middle').append(this.discardPileView.el);
        this.$el.find('.middle').append(this.drawPileView.el);
        return this;
    },
    show: function() {
        $('#game').show();
    },
    hide: function() {
        $('#game').hide();
    },
    toggle: function() {
        $('#game').toggle('slow');
    }
});


var MessageModal = Backbone.Modal.extend({
    template: '#warning_modal-template',
    cancelEl: '.close-button',
    initialize: function() {
        $('.warning-modal').html(this.render().el);
        var data = this.serializeData();
        if (data.type === 'warning') {
            $('.warning-modal').find('.bbm-modal__section div').addClass("text-danger");
        }
        if (data.type === 'info') {
            $('.warning-modal').find('.bbm-modal__section div').addClass("text-info");
        }
    }
});

var PlayerView = Backbone.View.extend({
    tagName: 'div',
    className : 'player',
    events: {
        'click': 'show_info'
    },
    template: _.template($('#player-template').html()),
    initialize: function(className) {
        if (className) {
            this.className = className;
        }
        _.bindAll(this, 'render');
    },
    render: function() {
        this.model.set('name_short', this.model.get('name').charAt(0).toUpperCase());
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    show_info: function(e) {
        new MessageModal({
            model: new Message({title: 'Player info', message: 'Player name: '+this.model.attributes.name, type: 'info'})
        });
    }
});

var PlayersView = Backbone.View.extend({
    tagName: 'div',
    className : 'players',
    initialize: function(ids) {
        var self = this;
        self.players = new PlayerCollection();
        this.players.add(app.player);
        ids.forEach(function(player_id){
            self.players.add(new Player({id:player_id}));
        });
        this.render();

        this.players.on("add", this.add_player, this);
        this.players.on("change", this.render, this);
        this.players.on("remove", this.render, this);
    },
    add_player: function() {
        this.render();
    },
    remove_player: function() {
        this.render();
    },
    render: function() {
        this.$el.html('');
        var idx = 1;
        this.players.each(function(model) {
            var player = new PlayerView({
                className: 'player-sm-'+idx,
                model: model
            });
            idx++;

            this.$el.append(player.render().el);
        }.bind(this));

        return this;
    },
    show: function() {
        this.$el.show();
    },
    hide: function() {
        this.$el.hide();
    }
});

var PileView = Backbone.View.extend({
    tagName: 'div',
    className : 'pile',
    template: _.template($('#pile-template').html()),
    events: {
        'click': 'show_info'
    },
    initialize: function() {
        var self = this;
        this.model.fetch().done(function(){
            _.bindAll(self, 'render');
            self.render();
        });
    },
    render: function() {
        if (DeckType[this.model.get('deck_type')] === 'DISCARD_DECK') {
            this.$el.addClass('discard-pile');
        }
        if (DeckType[this.model.get('deck_type')] === 'DRAW_PILE') {
            this.$el.addClass('draw-pile');
        }
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    show_info: function(e) {
        new MessageModal({
            model: new Message({title: 'Pile info', message: DeckType[this.model.get('deck_type')], type: 'info'})
        });
    },
    show: function() {
        this.$el.show();
    },
    hide: function() {
        this.$el.hide();
    }
});

