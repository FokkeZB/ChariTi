var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/youtube");

var CONFIG = arguments[0];

$.init = function() {
	$.TitleBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	
	MODEL.setUsername({
		username: CONFIG.username,
		callback: $.handleUsername
	});
};

$.handleUsername = function() {
	MODEL.retrieveVideos({
		callback: $.handleVideos
	});
};

$.handleVideos = function(_data) {
	var data = MODEL.getVideos();
	var rows = [];
	
	for(var i = 0, x = data.length; i < x; i++) {
		var row = Alloy.createController("youtube_row", {
			id: data[i].id,
			url: data[i].link,
			heading: data[i].title,
			subHeading: UTIL.toDateRelative(new Date(data[i].date).getTime())
		}).getView();
		
		rows.push(row);
	}
	
	$.content.setData(rows);
};

// Event listeners
$.content.addEventListener("click", function(_event) {
	APP.openDetailScreen("youtube_video", {
		url: _event.row.url,
		title: _event.row.setTitle
	});
});

// Kick off the init
$.init();