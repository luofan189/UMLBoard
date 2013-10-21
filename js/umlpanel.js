//UML panel
function UMLPanel(container, w, h) {
	this.graph = new joint.dia.Graph;
	this.uml = joint.shapes.uml;
	
	this.paper = new joint.dia.Paper({
		el: $(container),
		width: w,
		height: h,
		gridSize: 1,
		model: this.graph
	});
	this.elements = [];
	
	//default size
	this.elementDefaultWidth = 100;
	this.elementDefaultHeight = 150;
	
	
}

//public methods
UMLPanel.prototype = {
	addElement: function(element) {
		this.graph.addCell(element);
	},
	
	addElements: function(elements) {
		this.graph.addCells(elements);
	},
}