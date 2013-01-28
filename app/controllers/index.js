// Pull in the core APP singleton
var APP		= require("core");
var UTIL	= require("utilities");

// Make sure we always have a reference to global elements throughout the APP singleton
APP.MainWindow		= $.MainWindow;
APP.GlobalWrapper	= $.GlobalWrapper;
APP.ContentWrapper	= $.ContentWrapper;
APP.Tabs			= $.Tabs;

///////////////////////////
// Configuration process //
///////////////////////////

APP.Configuration	= $.Configuration;

function configureInit() {
	APP.GlobalWrapper.visible	= false;
	
	var db = Ti.Database.open("ChariTi");
	db.execute("CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY, url TEXT);");
	
	$.MainWindow.open();
	
	retrieve();
}

function retrieve() {
	var db		= Ti.Database.open("ChariTi");
	var data	= db.execute("SELECT url FROM urls ORDER BY id DESC LIMIT 10;");
	var temp	= [];
	var rows	= [];

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
			color: "#CCC"
		});
		
		rows.push(row);
	}
	
	$.ConfigurationHistory.setData(rows);
}

$.ConfigurationHistory.addEventListener("click", function(_event) {
	if(_event.row.title) {
		$.ConfigurationURLField.value = _event.row.title;
	}
});

$.ConfigurationSubmit.addEventListener("click", function(_event) {
	var URL = $.ConfigurationURLField.value;
	
	if(URL.length > 0) {
		// Update the configuration file
		APP.update({
			url: URL,
			callback: function() {
				// Remove configuration screen
				APP.GlobalWrapper.visible	= true;
				APP.Configuration.visible	= false;
				
				// Start the APP
				APP.init();
			}
		});
		
		var db = Ti.Database.open("ChariTi");
		db.execute("INSERT INTO urls VALUES(NULL, " + UTIL.escapeString(URL) + ");");
		db.close();
	}
});

configureInit();

///////////////////////////
// Configuration process //
///////////////////////////