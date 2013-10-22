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
UMLPanel.cellAttrUpdatedKey = 'cellattrupdate';
UMLPanel.elementChangePositionKey = 'elementchangeposition';

//public methods
UMLPanel.prototype = {
	addElement: function(element) {
		var self = this;
		this.graph.addCell(element);
		
		var cell = this.graph.getCell(element.id);
		//here is the trick
	    $('g[model-id="' + element.id + '"]').dblclick(function() {
	        $( "#dialog-form" ).dialog({
				autoOpen: false,
				width: 500,
				modal: true,
				open: function(){
					$('#cellname').val(cell.get('name'));
					$('#attributes').val(cell.get('attributes'));
					$('#methods').val(cell.get('methods'));
				},
				close: function() {
					var key = self.platform.getKeyByKeyname(UMLPanel.cellAttrUpdatedKey);
					key.set({id: cell.id, name: cell.get('name'), attributes: cell.get('attributes'), methods: cell.get('methods')});
				},
				buttons: [
					{
						text: "Save",
						click: function() {
							cell.set('name', $('#cellname').val());
							var attributes = $('#attributes').val();
							var attrArray = attributes.split(',');
							cell.set('attributes', attrArray);
							var methods = $('#methods').val();
							var methodArray = methods.split(',');
							cell.set('methods', methodArray);
							$( this ).dialog('close');
						}
					},
					{
						text: "Cancel",
						click: function() {
							$( this ).dialog('close');
						}
					}
				]
			});
			
			$( "#dialog-form" ).dialog('open');
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
			
			//add key to monitor the position change of the cell
			self.platform.addKey(UMLPanel.elementChangePositionKey, {}, function(key, context) {
				//listen to the set event
				key.on('set', function(value, context) {
					var cell = self.graph.getCell(value.id);
					cell.set('position', value.position);
				});
			});
			
			//add key to monitor the attributes change of the cell
			self.platform.addKey(UMLPanel.cellAttrUpdatedKey, {}, function(key, context) {
				//listen to the set event
				key.on('set', function(value, context) {
					if (value.id != null) {
						var cell = self.graph.getCell(value.id);
						cell.set('name', value.name);
						cell.set('attributes', value.attributes);
						cell.set('methods', value.methods);
					}
				});
			});
			
			//event handlers to set the keys
			self.graph.on('add', function(cell) {
				//set the key and notify other users
				var key = self.platform.getKeyByKeyname(UMLPanel.graphAddKey);
				key.set(cell);
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