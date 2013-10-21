var umlboard = (function() {
	var appURL = 'https://goinstant.net/luofan189/UMLBoard';
	
	var platform;
	var umlPanel;

	function connectToPlatform(url) {
		platform = new Platform(url);
		platform.start();
	}
	
	function initUMLClassGraph() {
		$(function() {
			$( ".selectable" ).selectable();
		});
		
		$('#class-panel-selectable').append('<li id="diagram-class" class="ui-widget-content">Class</li>');
		$('#class-panel-selectable').append('<li id="diagram-interface" class="ui-widget-content">Interface</li>');
		$('#class-panel-selectable').append('<li id="diagram-abstract" class="ui-widget-content">Abstract Class</li>');
		$('#class-panel-selectable').append('<li id="diagram-enum" class="ui-widget-content">Enum</li>');
		
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
		
		$('#arrow-panel-selectable').append('<li class="ui-widget-content">Link1</li>');
		$('#arrow-panel-selectable').append('<li class="ui-widget-content">Line2</li>');
		$('#arrow-panel-selectable').append('<li class="ui-widget-content">Link3</li>');
		$('#arrow-panel-selectable').append('<li class="ui-widget-content">Link4</li>');
	}
	
	function initUMLGraph() {
		initUMLClassGraph();
		initUMLArrowGraph();
		
		//setup the drappable area
		$('#uml-board').droppable({
			drop: function(event, ui) {
				var pos = ui.offset, dPos = $(this).offset();
				
				var uml = joint.shapes.uml;
				var bloodgroup = new uml.Class({
			        position: { x: (pos.left - dPos.left), y: (pos.top - dPos.top) },
			        size: { width: 200, height: 100 },
			        name: 'Class',
			        attributes: [],
			        methods: []
			    });
				
				umlPanel.addElement(bloodgroup);
			},
		});
	}
	
	function initDrawingPanel() {
		umlPanel = new UMLPanel('#uml-board', 800, 600);
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

