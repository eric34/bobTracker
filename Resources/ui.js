var ui={};

module.exports = ui;

ui.makeApplicationTabgroup =function() {
	var self = Ti.UI.createTabGroup();
	var compassWindow = ui.makeCompassWindow();
	var locationWindow = ui.makeLocationWindow();
	var waypointsWindow = ui.makeWaypointsWindow();
	
	var compassTab = Ti.UI.createTab({
		title: "Compass",
		icon: 'compass.png',
		window: compassWindow
	});
	
	var waypointsTab = Ti.UI.createTab({
		title: "Waypoints",
		icon: 'waypoint.png',
		window: waypointsWindow
	});

	var locationTab = Ti.UI.createTab({
		title: "Location",
		icon: 'location.png',
		window: locationWindow
	});

	self.add(compassTab);
	self.add(waypointsTab);
	self.add(locationTab);

	return self;
}

ui.makeBasicWindow = function() {
			
	// Assume iPhone not 5, and set some stuff
	var backgroundImage='/images/newCompass@2x.png';
	var degreeLabelTop=10;
	var waypointBox=30;
	var backgroundColor='#262e2f';
	
	// check for iPhone 5, and set stuff if so
	if (Titanium.Platform.displayCaps.platformHeight===568) {
		isIphone5=true;
		backgroundImage='/images/newCompass-568h@2x.png';
		degreeLabelTop=40;
		waypointBox=50;
		}
		
	
	var self = Ti.UI.createWindow({
		backgroundColor:'#262e2f'	
	});
}

ui.makeCompassWindow = function() {
	
	// Assume iPhone not 5, and set some stuff
	var backgroundImage='/images/newCompass@2x.png';
	var degreeLabelTop=10;
	var waypointBox=30;
	
	// check for iPhone 5, and set stuff if so
	if (Titanium.Platform.displayCaps.platformHeight===568) {
		isIphone5=true;
		backgroundImage='/images/newCompass-568h@2x.png';
		degreeLabelTop=40;
		waypointBox=50;
		}
	
	var self = 	
}

ui.makeLocationWindow = function () {
	
}

ui.makeWaypointsWindow = function () {
	
}
