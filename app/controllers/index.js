// Pull in the core APP singleton
var APP = require("core");
var UTIL = require("utilities");

// Make sure we always have a reference to global elements throughout the APP singleton
APP.MainWindow = $.MainWindow;
APP.GlobalWrapper = $.GlobalWrapper;
APP.ContentWrapper = $.ContentWrapper;
APP.Tabs = $.Tabs;

///////////////////////////
// Configuration process //
///////////////////////////

APP.Configuration = $.Configuration;

APP.configureInit = function() {
	APP.GlobalWrapper.visible = false;
	APP.Configuration.visible = true;

	var db = Ti.Database.open("ChariTi");
	db.execute("CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY, url TEXT);");

	APP.MainWindow.open();
	APP.configRetrieve();
};

APP.configRetrieve = function() {
	var db = Ti.Database.open("ChariTi");
	var data = db.execute("SELECT url FROM urls ORDER BY id DESC LIMIT 10;");
	var temp = [];
	var rows = [];

	while(data.isValidRow()) {
		temp.push(data.fieldByName("url"));

		data.next();
	}

	data.close();
	db.close();

	for(var i = 0, z = temp.length; i < z; i++) {
		var row = Ti.UI.createTableViewRow({
			title: temp[i],
			height: Ti.UI.SIZE,
			selectedBackgroundColor: "#222",
			font: {
				fontSize: "16dp",
				fontWeight: "bold"
			},
			color: "#666",
			hasChild: true
		});

		rows.push(row);
	}

	$.ConfigurationHistory.setData(rows);
};

$.ConfigurationURLField.addEventListener("return", function(_event) {
	var URL = $.ConfigurationURLField.value;

	if(URL.length > 0) {
		Ti.App.Properties.setString("URL", URL);

		// Update the configuration file
		require("update").init({
			url: URL,
			callback: function() {
				// Remove configuration screen
				APP.GlobalWrapper.visible = true;
				APP.Configuration.visible = false;

				// Rebuild
				APP.rebuild();

				// Start the APP
				APP.init();
			}
		});

		// Save the history
		var db = Ti.Database.open("ChariTi");
		db.execute("INSERT INTO urls VALUES(NULL, " + UTIL.escapeString(URL) + ");");
		db.close();
	}
});

$.ConfigurationHistory.addEventListener("click", function(_event) {
	var URL = _event.row.title;

	if(URL.length > 0) {
		Ti.App.Properties.setString("URL", URL);

		// Update the configuration file
		require("update").init({
			url: URL,
			callback: function() {
				// Remove configuration screen
				APP.GlobalWrapper.visible = true;
				APP.Configuration.visible = false;

				// Rebuild
				APP.rebuild();

				// Start the APP
				APP.init();
			}
		});
	}
});

APP.configureInit();

///////////////////////////
// Configuration process //
///////////////////////////