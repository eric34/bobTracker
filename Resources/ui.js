var ui={};
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
		title: "Compass",
		icon: 'compass.png',
		window: ui.compassWindow
	});
	
	var waypointsTab = Ti.UI.createTab({
		title: "Waypoints",
		icon: 'waypoint.png',
		window: ui.waypointsWindow
	});

	var locationTab = Ti.UI.createTab({
		title: "Location",
		icon: 'location.png',
		window: ui.locationWindow
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
var degreeLabelTop = 10;
var waypointBox = 75;
var waypointboxmargin=5;

// check for iPhone 5, and set stuff if so
if (Titanium.Platform.displayCaps.platformHeight === 568) {
	isIphone5 = true;
	backgroundImage = '/images/newCompass-568h@2x.png';
	ui.degreeLabelTop = 40;
	waypointBox = 120;
}

// ######################################################################

ui.headLabel = Ti.UI.createLabel({
	text : " 0°",
	top : degreeLabelTop,
	width : 150,
	color : 'white',
	font : { fontSize : 48 },
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
});

ui.needleImage = Ti.UI.createImageView({
	image : '/images/needle.png'
});

ui.wayneedleImage = Ti.UI.createImageView({
	image : '/images/newwayneedle.png'
});

var makeCompassWindow = function() {
	
	
	var win = Titanium.UI.createWindow({  
	    title:'Compass',
	    backgroundColor:'#fff',
	    backgroundImage:backgroundImage,
	    barColor:'#18223c'
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

	win.add(ui.headLabel);
	win.add(ui.wayneedleImage);
	win.add(waypointInfo);
	win.add(ui.needleImage);
	
	return win;
}

var makeWaypointsWindow = function () {
	
	var addButton = Ti.UI.createButton({
		title : "Add"
	});
	var win = Titanium.UI.createWindow({
		title : 'Waypoints',
		backgroundColor : '#fff',
		rightNavButton : addButton,
		barColor:'#18223c'
	}); 
	
	// create table view data object
	// move this to PositionData.js ???
	var data = [
		{title:'Pegati Lake Outlet', wayLatitude:59.8793306, wayLongitude:-160.1266278, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Paiyun Creek', wayLatitude:59.8914972, wayLongitude:-160.3706333, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Kanuktik Creek', wayLatitude:59.8737222, wayLongitude:-160.4757, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Nakgil Creek', wayLatitude:59.854, wayLongitude:-160.6997417, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Sam Creek', wayLatitude:59.79305, wayLongitude:-160.7500778, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Klak Creek', wayLatitude:59.7805111, wayLongitude:-160.7705944, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Nukluk Creek', wayLatitude:59.7248556, wayLongitude:-160.9935833, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Kanektok Weir', wayLatitude:59.7672306, wayLongitude:-161.0606194, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Duncan Bros. Upper Camp', wayLatitude:59.8197056, wayLongitude:-161.3057944, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Duncan Bros. Lower Camp', wayLatitude:59.8076583, wayLongitude:-161.5480722, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Togiak Refuge Border', wayLatitude:59.8043667, wayLongitude:-161.5887778, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Alaska West Camp', wayLatitude:59.7794167, wayLongitude:-161.7716167, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Pull Out', wayLatitude:59.7565583, wayLongitude:-161.8846028, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'On the corner', wayLatitude:37.337681, wayLongitude:-122.038193, hasChild:true, color:'#000', font:{fontWeight : 'bold'}},
		{title:'Mountain View', wayLatitude:37.337681, wayLongitude:-122.038193, hasChild:true, color:'#000', font:{fontWeight : 'bold'}}
	];
	
	// make a header view for the sction - this one is "default waypoints"
	var headerView = Ti.UI.createView({height:Ti.UI.SIZE,width:Ti.UI.SIZE});
	var myTestText = Ti.UI.createLabel({text:"Default waypoints",color:'white',left: 10, top:15,width:Ti.UI.SIZE,font : { fontSize: 18, fontWeight:'bold'}});
	headerView.add(myTestText);
	
	
	var tableViewOptions = {
		data : data,
		headerView : headerView,
		//headerTitle:'Default waypoints',
		//headerColor:'white',
		//backgroundImage:backgroundImage,
		backgroundColor : '#262e2f',
		rowBackgroundColor : 'white',
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED
	}; 
	
	var tableview = Titanium.UI.createTableView(tableViewOptions);
	win.add(tableview);
	
	return win;
}


// make some labels for Mountain View TESTING
ui.distanceLabel = Ti.UI.createLabel({
	text : "You are this many miles from MV:",
	color : 'white',
	top : 5
});
// var distvalueLabel=Ti.UI.createLabel({color:'white', top:5});
// var bearingLabel=Ti.UI.createLabel({text:"Waypoint bearing is degrees", color:'white', top:5});
ui.bearvalueLabel = Ti.UI.createLabel({
	color : 'white',
	top : 5
});
ui.distvalueLabel = Ti.UI.createLabel({
	color : 'white',
	top : 5
});
ui.bearingLabel = Ti.UI.createLabel({
	text : "Waypoint bearing is degrees",
	color : 'white',
	top : 5
});

// make some labels for the various data points for current location
ui.currentLocationLabel = Ti.UI.createLabel({
	text : "Current Location",
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
	left : 10,
	color : 'white',
	top : 5
});
ui.currentSpeedLabel = Ti.UI.createLabel({
	text : "Speed:",
	left : 10,
	color : 'white',
	top : 5
});

var makeLocationWindow = function () {
	
	var win = Titanium.UI.createWindow({
		title : 'Location',
		layout : 'vertical',
		backgroundColor : '#262e2f',
		barColor:'#18223c'
	}); 
	
	// make some labels for Mountain View TESTING
	var distanceLabel=Ti.UI.createLabel({text:"You are this many miles from MV:", color:'white', top:5});
	// var distvalueLabel=Ti.UI.createLabel({color:'white', top:5});
	// var bearingLabel=Ti.UI.createLabel({text:"Waypoint bearing is degrees", color:'white', top:5});
	var bearvalueLabel=Ti.UI.createLabel({color:'white', top:5});
	

	
	// make the current location view
	var currentLocationView = Ti.UI.createView({
		borderRadius : 10,
		borderColor : 'black',
		layout: 'vertical',
		borderWidth : 3,
		top:3,
		height: '33%'
	
	});
	
	// make the active waypoint view
	var activeWaypointView = Ti.UI.createView({
		borderRadius : 10,
		borderColor : 'black',
		layout: 'vertical',
		borderWidth : 3,
		height: '33%'
	
	});
	
	// make the pull out waypoint view
	var pulloutWaypointView = Ti.UI.createView({
		borderRadius : 10,
		borderColor : 'black',
		layout: 'vertical',
		borderWidth : 3,
		height: '33%'
	
	});
	
	// add the current location labels
	currentLocationView.add(ui.currentLocationLabel);
	currentLocationView.add(ui.currentLatLabel);
	currentLocationView.add(ui.currentLonLabel);
	currentLocationView.add(ui.currentAltLabel);
	currentLocationView.add(ui.currentSpeedLabel);
	
	// add some labels for the pull out section
	pulloutWaypointView.add(ui.distanceLabel);
	// pulloutWaypointView.add(distvalueLabel);
	// pulloutWaypointView.add(bearingLabel);
	pulloutWaypointView.add(ui.distvalueLabel);
	pulloutWaypointView.add(ui.bearingLabel);
	pulloutWaypointView.add(ui.bearvalueLabel);
	
	
	//add the info views
	win.add(currentLocationView);
	win.add(activeWaypointView);
	win.add(pulloutWaypointView);

	
	return win;
}