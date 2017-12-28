require.config({
	baseUrl: "api/static",
	paths: {
		jquery: "lib/jquery-3.2.1.min",
		underscore: "lib/underscore-min",
		backbone: "lib/backbone-min",
		socketio: "lib/socket.io",
		main: "js/main",
	},
	shim: {
	    'jquery': {
          exports: '$'
        },
        'socketio': {
          exports: 'io'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});