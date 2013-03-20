var ui={};
module.exports = ui;

ui.makeApplicationTabgroup =function() {
	var self = Ti.UI.createTabGroup();
	var compassWindow = makeCompassWindow();
	var locationWindow = makeLocationWindow();
	var waypointsWindow = makeWaypointsWindow();
	
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

	self.addTab(compassTab);
	self.addTab(waypointsTab);
	self.addTab(locationTab);

	return self;
}

// ui.makeCompassWindow is used only for testing purpose
// should make it into a function object (var makeCompassWindow) since it's only used in ui.makeApplicationTabgroup
ui.makeCompassWindow = function() {
	
	// Assume iPhone not 5, and set some stuff
	var backgroundImage = '/images/newCompass@2x.png';
	var degreeLabelTop = 10;
	var waypointBox = 75;
	var waypointboxmargin=5;
	
	// check for iPhone 5, and set stuff if so
	if (Titanium.Platform.displayCaps.platformHeight === 568) {
		isIphone5 = true;
		backgroundImage = '/images/newCompass-568h@2x.png';
		degreeLabelTop = 40;
		waypointBox = 50;
	}
	
	var win = Titanium.UI.createWindow({  
	    title:'Compass',
	    backgroundColor:'#fff',
	    backgroundImage:backgroundImage
	});	

	// make a couple labels to show some data
	var headLabel = Ti.UI.createLabel({
		text : " 0°",
		top : degreeLabelTop,
		width : 150,
		color : 'white',
		font : { fontSize : 48 },
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
	}); 

	var needleImage = Ti.UI.createImageView({
		image : '/images/needle.png'
	});

	//make the waypoint needle image
	var wayneedleImage = Ti.UI.createImageView({
		image : '/images/newwayneedle.png'
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

	var wayPointTestLabel = Ti.UI.createLabel({
		text : "No active waypoint",
		color : "black"
	});
	waypointInfo.add(wayPointTestLabel); 

	win.add(headLabel);
	win.add(wayneedleImage);
	win.add(waypointInfo);
	win.add(needleImage);
	
	return win;
}

var makeLocationWindow = function () {
	
}

var makeWaypointsWindow = function () {
	
}

// var makeBasicWindow = function() {
// 			
	// // Assume iPhone not 5, and set some stuff
	// var backgroundImage='/images/newCompass@2x.png';
	// var degreeLabelTop=10;
	// var waypointBox=30;
	// var backgroundColor='#262e2f';
// 	
	// // check for iPhone 5, and set stuff if so
	// if (Titanium.Platform.displayCaps.platformHeight===568) {
		// isIphone5=true;
		// backgroundImage='/images/newCompass-568h@2x.png';
		// degreeLabelTop=40;
		// waypointBox=50;
		// }
// 		
// 	
	// var self = Ti.UI.createWindow({
		// backgroundColor:'#262e2f'	
	// });
// }