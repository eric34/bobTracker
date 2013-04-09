var ui = {};
module.exports = ui;

// making compassWindow, waypointsWindow, and locationWindow available to other files
// these windows object can be used with geo.js
// these windows won't be created until you makeApplicationTabgroup
ui.compassWindow = undefined;
ui.waypointsWindow = undefined;
ui.locationWindow = undefined;
ui.makeApplicationTabgroup = function() {
	var self = Ti.UI.createTabGroup();

	ui.compassWindow = makeCompassWindow();
	ui.waypointsWindow = makeWaypointsWindow();
	ui.locationWindow = makeLocationWindow();

	var compassTab = Ti.UI.createTab({
		title : "Compass",
		icon : 'compass.png',
		window : ui.compassWindow
	});

	var waypointsTab = Ti.UI.createTab({
		title : "Waypoints",
		icon : 'waypoint.png',
		window : ui.waypointsWindow
	});

	var locationTab = Ti.UI.createTab({
		title : "Location",
		icon : 'location.png',
		window : ui.locationWindow
	});

	self.addTab(compassTab);
	self.addTab(waypointsTab);
	self.addTab(locationTab);

	return self;
}
// Some of the object functions below (e.g. var makeCompassWindow) don't need be in the ui namespace
// They'll only be used by makeApplicationTabgroup

// ######################################################################
// The following variables are being used by ui.headLabel and makeCompassWindow()

// Assume iPhone 4 and set some stuff
var backgroundImage = '/images/newCompass@2x.png';
var degreeLabelTop = 5;
var prefLabelTop = 55;
var waypointBox = 75;
var waypointboxmargin = 5;

// check for iPhone 5, and set stuff if so
if (Titanium.Platform.displayCaps.platformHeight === 568) {
	isIphone5 = true;
	backgroundImage = '/images/newCompass-568h@2x.png';
	degreeLabelTop = 40;
	prefLabelTop = 100;
	waypointBox = 120;
}

// ######################################################################

ui.headLabel = Ti.UI.createLabel({
	text : " 0°",
	top : degreeLabelTop,
	width : 150,
	color : 'white',
	font : {
		fontSize : 48
	},
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
});

ui.prefLabel = Ti.UI.createLabel({
	text : geo.headingPref,
	top : prefLabelTop,
	width : 50,
	color : '#b8c7d3',
	font : {
		fontSize : 18
	},
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
});


ui.needleImage = Ti.UI.createImageView({
	image : '/images/needle.png'
});

ui.wayneedleImage = Ti.UI.createImageView({
	image : '/images/newwayneedle.png'
});

ui.waypointLabel = Ti.UI.createLabel({
	text : "No active waypoint",
	color : "black"
});

// I need to turn on and turn off the waypoint needle and do the other stuff to the labels
ui.activeWaypoint = function(e) {
	if (e) {
		ui.wayneedleImage.show();
		ui.waypointLabel.color = 'white';
		geo.activeWaypoint = true;
	} else {
		ui.wayneedleImage.hide();
		ui.waypointLabel.color = 'black';
		ui.waypointLabel.text = "No active waypoint"
		geo.activeWaypoint = false;
	}
}


var makeCompassWindow = function() {

	var win = Titanium.UI.createWindow({
		title : 'Compass',
		backgroundColor : '#fff',
		backgroundImage : backgroundImage,
		barColor : '#18223c',
		openedFlag : 0
	});

	//add waypoint info view
	var waypointInfo = Ti.UI.createView({
		height : waypointBox,
		width : (Titanium.Platform.displayCaps.platformWidth - (2 * waypointboxmargin)),
		// too small on retina, just right on iphone 5, so use the margin to give a few extra pixels
		backgroundColor : '#262e2f',
		bottom : waypointboxmargin,
		// same here - get a few extra pixels on non 5
		borderRadius : 10,
		borderColor : 'black',
		borderWidth : 3

	});

	waypointInfo.add(ui.waypointLabel);

	win.add(ui.headLabel);
	win.add(ui.prefLabel);
	win.add(ui.wayneedleImage);
	
	ui.wayneedleImage.hide(); // should need to remove later when I can load an active waypoint from a property
	
	win.add(waypointInfo);
	win.add(ui.needleImage);
	

	// --------------->
	// test turn off waypoint button
	var testButton = Ti.UI.createButton({
		title : "click",
		top : 0,
		left : 0
	});
	testButton.addEventListener('click', function() {
		ui.activeWaypoint(false);
	});
	win.add(testButton);
	// ---------------->

	return win;
}




// this will be loaded with an array of waypoint objects before mainTabGroup opens
ui.defaultWaypoints = null;
var makeWaypointsWindow = function() {

	var addButton = Ti.UI.createButton({
		title : "Add"
	});
	var win = Titanium.UI.createWindow({
		title : 'Waypoints',
		backgroundColor : '#fff',
		rightNavButton : addButton,
		barColor : '#18223c'
	});
	
	// make a header view for the sction - this one is "default waypoints"
	var headerView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE
	});
	var myTestText = Ti.UI.createLabel({
		text : "Default waypoints",
		color : 'white',
		left : 10,
		top : 15,
		width : Ti.UI.SIZE,
		font : {
			fontSize : 18,
			fontWeight : 'bold'
		}
	});
	headerView.add(myTestText);

	// If I can implment the "add waypoint" feature, I'll make another table section called  "user waypoints" or similar'

	var tableViewOptions = {
		data : ui.defaultWaypoints,
		headerView : headerView,
		backgroundColor : '#262e2f',
		rowBackgroundColor : 'white',
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED
	};

	var tableview = Titanium.UI.createTableView(tableViewOptions);

	// Add the event Listener to set the active waypoint
	// I should make this into a function, but where to put it? UI or GEO? basically call set active waypoint and combine the other functions.
	tableview.addEventListener('click', function(e) {
		geo.activeWaypoint = true;
		geo.activeName = e.rowData.title;
		geo.activeLat = e.rowData.wayLatitude;
		geo.activeLon = e.rowData.wayLongitude;
		geo.activeDist = geo.distanceCheck(geo.latitude, geo.longitude, geo.activeLat, geo.activeLon);
		ui.currentWaypointDist.text = geo.activeDist+" Miles"; // set the location label for distance
		geo.activeBearing = geo.bearingCheck(geo.latitude, geo.longitude, geo.activeLat, geo.activeLon);
		ui.currentWaypointBear.text = geo.activeBearing+"°"; // set the location label for bearing
		ui.currentWaypointName.text = geo.activeName;

		ui.waypointLabel.text = geo.activeName + "  Latitude: " + geo.activeLat + "  Longitude: " + geo.activeLon + " Bearing: " + geo.activeBearing + " Distance: " + geo.activeDist;
		
		// Run function to turn on the label and set the color white, also turn on the waypoint needle
		ui.activeWaypoint(true);
		mainTabGroup.setActiveTab(0);
	});

	win.add(tableview);

	return win;
}

// make some labels for the various data points for current location
ui.currentLocationLabel = Ti.UI.createLabel({
	text : "Current Location:",
	left : 5,
	color : 'white',
	top : 5
});
ui.currentLatLabel = Ti.UI.createLabel({
	text : "Latitude:",
	left : 10,
	color : 'white',
	top : 5
});
ui.currentLonLabel = Ti.UI.createLabel({
	text : "Longitude:",
	left : 10,
	color : 'white',
	top : 5
});
ui.currentAltLabel = Ti.UI.createLabel({
	text : "Altitude:",
	color : 'white',
	left: 5
});
ui.currentSpeedLabel = Ti.UI.createLabel({
	text : "Speed:",
	color : 'white',
	left : 10
});
ui.currentGPSHeadLabel = Ti.UI.createLabel({
	text : "Moving:",
	color : 'white',
	left : 10
	
});

// Current selected waypoint labels
ui.currentWaypointLabel = Ti.UI.createLabel({
	text : "Active Waypoint:",
	left : 5,
	color : 'white',
	top : 5
});
ui.currentWaypointName = Ti.UI.createLabel({
	text : "WP Name",
	left : 5,
	color : 'white',
	top : 5
});
ui.currentWaypointDist = Ti.UI.createLabel({
	text : "WP Dist",
	left : 5,
	color : 'white',
	top : 5
});
ui.currentWaypointBear = Ti.UI.createLabel({
	text : "WP Bearing",
	left : 5,
	color : 'white',
	top : 5
});

// And pullout Waypoint labels
ui.pulloutWaypointLabel = Ti.UI.createLabel({
	text : "Pullout Waypoint:",
	left : 5,
	color : 'white',
	top : 5
});
ui.pulloutWaypointDist = Ti.UI.createLabel({
	text : "PO dist",
	left : 5,
	color : 'white',
	top : 5
});
ui.pulloutWaypointBear = Ti.UI.createLabel({
	text : "PO Bear",
	left : 5,
	color : 'white',
	top : 5
});


// and make the location window
var makeLocationWindow = function() {

	var win = Titanium.UI.createWindow({
		title : 'Location',
		layout : 'vertical',
		backgroundColor : '#262e2f',
		barColor : '#18223c'
	});

	// make the current location view
	var currentLocationView = Ti.UI.createView({
		borderRadius : 10,
		borderColor : 'black',
		layout : 'vertical',
		borderWidth : 3,
		top : 3,
		height : '50%'

	});

	// make another view to hold the bottom row of data for current location
	var currentLocationOtherView = Ti.UI.createView({
		layout : 'horizontal',
		top : 3,
		left : 10

	});

	// make the active waypoint view
	var activeWaypointView = Ti.UI.createView({
		borderRadius : 10,
		borderColor : 'black',
		layout : 'vertical',
		borderWidth : 3,
		height : '25%'

	});


	// make the pull out waypoint view
	var pulloutWaypointView = Ti.UI.createView({
		borderRadius : 10,
		borderColor : 'black',
		layout : 'vertical',
		borderWidth : 3,
		height : '25%'

	});

	// add the current location labels
	currentLocationView.add(ui.currentLocationLabel);
	currentLocationView.add(ui.currentLatLabel);
	currentLocationView.add(ui.currentLonLabel);

	// bottom row of current location
	currentLocationOtherView.add(ui.currentAltLabel);
	currentLocationOtherView.add(ui.currentSpeedLabel);
	currentLocationOtherView.add(ui.currentGPSHeadLabel);
	currentLocationView.add(currentLocationOtherView);
	
	// add the active waypoint view
	activeWaypointView.add(ui.currentWaypointLabel);
	activeWaypointView.add(ui.currentWaypointName);
	activeWaypointView.add(ui.currentWaypointDist);
	activeWaypointView.add(ui.currentWaypointBear);

	// add some labels for the pull out section
	pulloutWaypointView.add(ui.pulloutWaypointLabel);
	pulloutWaypointView.add(ui.pulloutWaypointDist);
	pulloutWaypointView.add(ui.pulloutWaypointBear);

	//add the info views
	win.add(currentLocationView);
	win.add(activeWaypointView);
	win.add(pulloutWaypointView);

	return win;
}