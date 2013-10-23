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

UMLPanel.cellPositionChannel = 'cellpositionchannel';
UMLPanel.graphAddKey = 'addcell';
UMLPanel.graphRemoveKey = 'removecell';
UMLPanel.cellAttrUpdatedKey = 'cellattrupdate';

//public methods
UMLPanel.prototype = {
	notify: function(message) {
		$('<div />', { class: 'topbarnotification', text: message }).hide().
			prependTo('body').
			slideDown('fast').
			delay(2000).
			slideUp(function() { 
				$(this).remove(); 
			});
	},
	
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
							
							//set the key
							var key = self.platform.getKeyByKeyname(UMLPanel.cellAttrUpdatedKey);
							key.set({id: cell.id, name: cell.get('name'), attributes: cell.get('attributes'), methods: cell.get('methods')});
							
							$( this ).dialog('close');
						}
					},
					{
						text: "Delete",
						click: function() {
							cell.remove();
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
			
			$( "#dialog-form" ).show();
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
					//notification
					self.notify('A new ' + value.type + ' has been added.');
				});
			});
			
			self.platform.addKey(UMLPanel.graphRemoveKey, {}, function(key, context) {
				//listen to the set event
				key.on('set', function(value, context) {
					//notification
					self.notify('The cell with name "' + value.name + '" has been removed.');
					value.remove();
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
						
						//notification
						self.notify('Cell with name "' + cell.get('name') + '" has been updated by another user.');
					}
				});
			});
			
			//add channel
			self.platform.addChannel(UMLPanel.cellPositionChannel, function(msg, context) {
				//listen to the msg event
				var cell = self.graph.getCell(msg.id);
				cell.set('position', msg.position);
			});
			
			//event handlers to set the keys
			self.graph.on('add', function(cell) {
				//set the key and notify other users
				var key = self.platform.getKeyByKeyname(UMLPanel.graphAddKey);
				key.set(cell);
			});
			
			self.graph.on('remove', function(cell) {
				//set the key and notify other users
				var key = self.platform.getKeyByKeyname(UMLPanel.graphRemoveKey);
				key.set(cell);
			});
			
			self.paper.on('cell:pointermove', function(cellView, evt, x, y) {
				var cell = self.graph.getCell(cellView.model.id);
				var channel = self.platform.getKeyByChannelname(UMLPanel.cellPositionChannel);
				channel.message(
					{
						id: cell.id,
						position: cell.get('position'),
					},
					function(err, msg, context) {
						if (err) {
							throw err;
						}
					}
				);
			});
			
			
			self.paper.on('cell:pointerup ', function(cellView, evt, x, y) {

			});
			
		});
		
		
	}
}