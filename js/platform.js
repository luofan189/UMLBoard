function Platform(url) {
	this.url = url;
}

Platform.prototype = {
	getUrl: function() {
		return this.url;
	},
	
	start: function() {
		goinstant.connect(this.url, function (err, connection, lobby) {
            if (err) {
              // Could not connect to GoInstant
              throw err;
            }

            var name = lobby.key('name');
            var el = $('input[name="name"]');

            // The listener will be invoked every time the value of name is changed
            // by another user
            name.on('set', function(value, context) {
              el.val(value);
            });

            el.on('keyup', function() {
              name.set($(this).val());
            });
          });
	},
}