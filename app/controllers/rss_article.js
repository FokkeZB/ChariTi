var APP = require("core");
var SOCIAL = require("social");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");
var MODEL = require("models/rss")();

var CONFIG = arguments[0] || {};
var ACTION = {};

$.init = function() {
	APP.log("debug", "rss_article.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	$.handleData(MODEL.getArticle(CONFIG.id));
};

$.handleData = function(_data) {
	APP.log("debug", "rss_article.handleData");

	$.handleNavigation();

	$.heading.text = _data.title;
	$.text.value = _data.description;
	$.date.text = STRING.ucfirst(DATE(parseInt(_data.date)).fromNow());
	$.date.color = APP.Settings.colors.primary;

	if(_data.image) {
		var width = APP.Device.width - 60;

		var image = Ti.UI.createImageView({
			image: _data.image,
			width: width + "dp",
			height: Ti.UI.SIZE,
			preventDefaultImage: true
		});

		$.image.add(image);
	} else {
		$.content.remove($.image)
	}

	ACTION.url = _data.link;

	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible = APP.Device.isHandheld;
	$.NavigationBar.right.visible = true;
	$.NavigationBar.rightImage.image = "/images/action.png";
};

$.handleNavigation = function() {
	ACTION.next = MODEL.getNextArticle(CONFIG.id);
	ACTION.previous = MODEL.getPreviousArticle(CONFIG.id);

	var navigation = Alloy.createWidget("com.chariti.detailNavigation", null, {
		down: function(_event) {
			APP.log("debug", "rss_article @next");

			APP.addChild("rss_article", {
				id: ACTION.next.id,
				index: CONFIG.index
			});
		},
		up: function(_event) {
			APP.log("debug", "rss_article @previous");

			APP.addChild("rss_article", {
				id: ACTION.previous.id,
				index: CONFIG.index
			});
		}
	}).getView();

	$.NavigationBar.Wrapper.add(navigation);
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "rss_article @close");

	APP.removeAllChildren();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.log("debug", "rss_article @menu");

	SOCIAL.share(ACTION.url, $.NavigationBar.right);
});

// Kick off the init
$.init();