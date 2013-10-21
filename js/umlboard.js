var umlboard = (function() {
	var appURL = 'https://goinstant.net/luofan189/UMLBoard';
	
	var platform;
	var umlPanel;
	
	var elementDefaultWidth = 200;
	var elementDefaultHeight = 100;
	
	//define the different diagram id names
	var diagramClassId = "diagram-class";
	var diagramInterfaceId = "diagram-interface";
	var diagramAbstractId = "diagram-abstract";
	
	//define the different link type names
	var linkGeneralizationId = "link-generalization";
	var linkImplementationId = "link-implementation";
	var linkAggregationId = "link-aggregation";
	var linkCompositionId = "link-composition";

	function connectToPlatform(url) {
		umlPanel.startPlatform(url);
	}
	
	function initUMLClassGraph() {
		$(function() {
			$( ".selectable" ).selectable();
		});
		
		$('#class-panel-selectable').append('<li id="' + diagramClassId + '" class="ui-widget-content">Class</li>');
		$('#class-panel-selectable').append('<li id="' + diagramInterfaceId + '" class="ui-widget-content">Interface</li>');
		$('#class-panel-selectable').append('<li id="' + diagramAbstractId + '" class="ui-widget-content">Abstract Class</li>');
		
		$('#diagram-class').draggable({
			opacity: 0.7, helper: "clone",
		});
		
		$('#diagram-interface').draggable({
			opacity: 0.7, helper: "clone",
		});
		
		$('#diagram-abstract').draggable({
			opacity: 0.7, helper: "clone",
		});
		
		$('#diagram-enum').draggable({
			opacity: 0.7, helper: "clone",
		});
	}
	
	function initUMLArrowGraph() {
		$(function() {
			$( ".selectable" ).selectable();
		});
		
		$('#arrow-panel-selectable').append('<li id=' + linkGeneralizationId + 'class="ui-widget-content">Generalization</li>');
		$('#arrow-panel-selectable').append('<li id=' + linkImplementationId + 'class="ui-widget-content">Implementation</li>');
		$('#arrow-panel-selectable').append('<li id=' + linkAggregationId + 'class="ui-widget-content">Aggregation</li>');
		$('#arrow-panel-selectable').append('<li id=' + linkCompositionId + 'class="ui-widget-content">Composition</li>');
	}
	
	function initUMLGraph() {
		initUMLClassGraph();
		initUMLArrowGraph();
		
		//setup the drappable area
		$('#uml-board').droppable({
			drop: function(event, ui) {
				
				var uml = joint.shapes.uml;
				var pos = ui.offset, dPos = $(this).offset();
				var options = {
					position: { x: (pos.left - dPos.left), y: (pos.top - dPos.top) },
			        size: { width: elementDefaultWidth, height: elementDefaultHeight },
			        name: 'Class',
			        attributes: [],
			        methods: [],
				};
				
				var element;
				
				var type = $(ui.draggable).attr("id");
				switch(type) {
					case diagramClassId:
						element = new uml.Class(options);
						break;
					case diagramInterfaceId:
						options['name'] = 'Inteface';
						element = new uml.Interface(options);
						break;
					case diagramAbstractId:
						options['name'] = 'Abstract';
						element = new uml.Abstract(options);
						break;
					default:
						element = new uml.Class(options);
						break;
				}
				
				//add the new created element to the panel
				umlPanel.addElement(element);
			},
		});
	}
	
	function initDrawingPanel() {
		umlPanel = new UMLPanel('#uml-board', 1600, 1200);
	}
	
	function init() {
		$( "#diagram-accordion" ).accordion({
			heightStyle: "content",
		});
		
		//setup all the usable UML digrams and graphics
		initUMLGraph();
		
		//setup the drawing panel
		initDrawingPanel();
		
		//connect to the platform
		connectToPlatform(appURL);
	}
	
	return {
		init: init
	};
}());

umlboard.init();

