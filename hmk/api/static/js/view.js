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
        $('.lobby').toggle('slow');
        app.game_view = new GameView();
        socket.emit('join', {room: 'playground_'+$(e.currentTarget).data('playground').id, player: app.player.name});
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
    initialize: function() {
        this.render();
        this.toggle();
    },
    render: function() {
        this.$el.append(this.template());
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