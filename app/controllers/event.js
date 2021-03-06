var APP = require("core");
var DATE = require("alloy/moment");
var MODEL = require("models/event")();

var CONFIG = arguments[0];
var SELECTED;

$.init = function() {
	APP.log("debug", "event.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	CONFIG.feed = "https://graph.facebook.com/" + CONFIG.userid + "/events?fields=id,name,start_time,end_time,location,description&since=now&access_token=AAAEdFU8bj50BAL7MQcSHuIDf1KzST7gZAAubz49tio8yLM8Lb7o29IxtxZALrogeimSAsTkYXJRzzqrRqSniABwtDRPONoQxsdNy6XQjIaRR9sedAM";

	APP.openLoading();

	$.retrieveData();

	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible = true;
	$.NavigationBar.rightImage.image = "/images/settings.png";

	if(CONFIG.isChild === true) {
		$.NavigationBar.back.visible = true;
	}
};

$.retrieveData = function(_force, _callback) {
	MODEL.fetch({
		url: CONFIG.feed,
		cache: _force ? 0 : CONFIG.cache,
		callback: function() {
			$.handleData(MODEL.getAllEvents());

			if(typeof _callback !== "undefined") {
				_callback();
			}
		}
	});
};

$.handleData = function(_data) {
	APP.log("debug", "event.handleData");

	var rows = [];

	for(var i = 0, x = _data.length; i < x; i++) {
		var row = Alloy.createController("event_row", {
			id: _data[i].id,
			heading: _data[i].title,
			subHeading: DATE(parseInt(_data[i].date_start)).format("MMMM Do, YYYY h:mma")
		}).getView();

		rows.push(row);
	}

	$.content.setData(rows);

	APP.closeLoading();

	if(APP.Device.isTablet) {
		SELECTED = _data[0].id;

		APP.addChild("event_event", {
			id: _data[0].id,
			index: CONFIG.index
		});
	}
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "event @close");

	APP.removeChild();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.content.addEventListener("click", function(_event) {
	APP.log("debug", "event @click " + _event.row.id);

	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}

	APP.addChild("event_event", {
		id: _event.row.id,
		index: CONFIG.index
	});
});

// Kick off the init
$.init();