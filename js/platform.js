function Platform(url) {
	this.url = url;
	this.attrs = {};
}

Platform.prototype = {
	start: function(callback) {
		var self = this;
		goinstant.connect(this.url, function (err, connection, room) {
            if (err) {
              // Could not connect to GoInstant
              throw err;
			  return;
            }
			
			self.attrs = {
				connection: connection,
				room: room,
				keys: [],
			};
			
			//now call the callback
			callback();
          });
	},
	
	getKeyByKeyname: function(keyname) {
		var self = this;
		var key = null;
		
		Object.keys(self.attrs.keys).forEach(function (index) {
			var keyvaluepair = self.attrs.keys[index];
			if (keyvaluepair.name == keyname) {
				key = keyvaluepair.value;
			}
		});
		
		return key;
	},
	
	addKey: function(keyname, keyvalue, callback) {
		var self = this;
		var key = this.attrs.room.key(keyname);
		
		key.add(keyvalue, function(err, context) {
			if (err) {
				throw err;
			}
			
			var keyvaluepair = {name: keyname, value: key};
			self.attrs.keys.push(keyvaluepair);
			callback(key, context);
		});
	},
	
	removeKey: function(keyname, callback) {
		var key = this.attrs.room.key(keyname);
		
		key.remove(function(err, value, context) {
			if (err) {
				throw err;
			}
			
			self.attrs.keys[keyname] = null;
		});
	},
}