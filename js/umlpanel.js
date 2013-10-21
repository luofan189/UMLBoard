//UML panel
function UMLPanel(container, w, h) {	
	this.graph = new joint.dia.Graph;
	this.uml = joint.shapes.uml;
	this.platform = {};
	this.paper = new joint.dia.Paper({
		el: $(container),
		width: w,
		height: h,
		gridSize: 1,
		model: this.graph
	});
	this.elements = [];
}

UMLPanel.addCellKey = "addcell";
UMLPanel.removeCellKey = "removecell";

//public methods
UMLPanel.prototype = {
	addElement: function(element) {
		var self = this;
		//setup goinstant key for the new element
		this.platform.addKey(element.id, 'testkeyvalue', function(key, context) {
		
			key.get(function(err, value, context) {
				if (err) {
					throw err;
				}

				Object.keys(value).forEach(function (index) {
					//alert(value[index]);
				});
			});

		});
		
		element.on('change', function(cell) {
			key.set(cell.id);
		});
		this.graph.addCell(element);
	},
	
	addElements: function(elements, callbacks) {
		this.graph.addCells(elements);
	},
	
	startPlatform: function(url) {
		//start goinstant platform
		var self = this;
		self.platform = new Platform(url);
		self.platform.start(function() {
		
			//add keys to monitor adding/removing cells
			self.platform.addKey(UMLPanel.addCellKey, {}, function(key, context) {
				//listen to the set event
				key.on('set', function(value, context) {
					self.graph.addCell(value);
				});
			});
			self.platform.addKey(UMLPanel.removeCellKey, {}, function(key, context) {
			});
			
			//event handlers to set the keys
			self.graph.on('add', function(cell) {
				//set the key and notify other users
				var key = self.platform.getKeyByKeyname(UMLPanel.addCellKey);
				key.set(cell);
			});
			
			/*
			self.graph.on('remove', function(cell) {
				//set the key and notify other users
				self.platform.getKeyByKeyname(UMLPanel.removeCellKey).set(cell);
			});
			*/
		});
		
		
	}
}