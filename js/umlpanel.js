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

UMLPanel.graphAddKey = 'addcell';
UMLPanel.elementChangePositionKey = 'elementchangeposition';

//public methods
UMLPanel.prototype = {
	addElement: function(element) {
		var self = this;
		this.graph.addCell(element);
		
		//here is the trick
	    $('g[model-id="' + element.id + '"]').dblclick(function() {
	        alert("Cell is double clicked!");
	    });
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
			self.platform.addKey(UMLPanel.graphAddKey, {}, function(key, context) {
				//listen to the set event
				key.on('set', function(value, context) {
					self.graph.addCell(value);
				});
			});
			
			self.platform.addKey(UMLPanel.elementChangePositionKey, {}, function(key, context) {
				//listen to the set event
				key.on('set', function(value, context) {
					var cell = self.graph.getCell(value.id);
					cell.set('position', value.position);
				});
			});
			
			
			//event handlers to set the keys
			self.graph.on('add', function(cell) {
				//set the key and notify other users
				var key = self.platform.getKeyByKeyname(UMLPanel.graphAddKey);
				key.set(cell);
			});
			
			self.paper.on('cell:pointerdown', function(cellView, evt, x, y) {
				
			});
			
			self.paper.on('cell:pointermove', function(cellView, evt, x, y) {
				var key = self.platform.getKeyByKeyname(UMLPanel.elementChangePositionKey);
				var cell = self.graph.getCell(cellView.model.id);
				key.set(cell);
			});
			
			
			self.paper.on('cell:pointerup ', function(cellView, evt, x, y) {

			});
			
		});
		
		
	}
}