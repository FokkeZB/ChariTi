var APP = require("core");
var MODEL = require("models/flickr");

var CONFIG = arguments[0];

$.init = function() {
	$.TitleBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	
	MODEL.setApiKey(CONFIG.apiKey);
	
	MODEL.generateNsid({
		username: CONFIG.username,
		callback: $.handleNsid
	});
};

$.handleNsid = function() {
	MODEL.retrieveSets({
		callback: $.handleSets
	});
};

$.handleSets = function(_data) {
	var data = MODEL.getSets();
	var rows = [];
	
	for(var i = 0, x = data.length; i < x; i++) {
		var row = Alloy.createController("flickr_row", {
			id: data[i].id,
			heading: data[i].title,
			subHeading: data[i].photo_count + " Photos"
		}).getView();
		
		rows.push(row);
	}
	
	$.content.setData(rows);
};

// Event listeners
$.content.addEventListener("click", function(_event) {
	APP.openDetailScreen("flickr_album", {
		id: _event.row.id,
		title: _event.row.setTitle
	});
});

// Kick off the init
$.init();