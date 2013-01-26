// Pull in the core APP singleton
var APP = require("core");

// Make sure we always have a reference to global elements throughout the APP singleton
APP.MainWindow = $.MainWindow;
APP.GlobalWrapper = $.GlobalWrapper;
APP.ContentWrapper = $.ContentWrapper;
APP.Tabs = $.Tabs;

var dialog = Ti.UI.createAlertDialog({
	title: "Configuration File URL",
	style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
	buttonNames: [ "Continue" ]
});

dialog.addEventListener('click', function(e){
	// Update the configuration file
	APP.update({
		url: e.text,
		callback: function() {
			// Start the APP
			APP.init();
		}
	});
});

dialog.show();