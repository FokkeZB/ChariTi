var APP = require("core");
var HTTP = require("http");

/**
 * Updates the app.json from a remote source
 */
exports.init = function(_params) {
	APP.log("debug", "UPDATE.init");

	if(_params.url) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "DATA",
			url: _params.url,
			success: exports.handleUpdate,
			passthrough: _params.callback
		});
	}
};

/**
 * Handles the update with the new configuration file
 */
exports.handleUpdate = function(_data, _url, _callback) {
	APP.log("debug", "UPDATE.handleUpdate");

	// Determine if this is the same version as we already have
	var data = JSON.parse(_data);

	// Grab the items from the manifest
	if(data.manifest) {
		exports.updateManifest(data.manifest);
	}

	// Write JSON file
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "app.json");
	file.write(_data);
	file = null;

	if(typeof _callback !== "undefined") {
		_callback();
	} else {}
};

/**
 * Retrieves remote items
 */
exports.updateManifest = function(_items) {
	APP.log("debug", "UPDATE.updateManifest");

	// Write manifest files
	for(var i = 0, x = _items.length; i < x; i++) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "DATA",
			url: _items[i],
			success: exports.handleManifest
		});
	}
};

/**
 * Stores remote items locally
 */
exports.handleManifest = function(_data, _url) {
	APP.log("debug", "UPDATE.handleManifest");

	// Determine file name
	var filename = _url.substring(_url.lastIndexOf("/") + 1);

	// Write manifest file
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename);
	file.write(_data);
	file = null;
};