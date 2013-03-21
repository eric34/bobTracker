


// THis is the fancy part I need to implement
//var geo= require('geo');
// geo.oneShot();


// This is for iOS to know why we are asking for location data
Ti.Geolocation.purpose = "GPS Location Finding";

// Assume iPhone not 5, and set some stuff
var backgroundImage='/images/newCompass@2x.png';
var degreeLabelTop=10;
var waypointBox=75;
var waypointboxmargin=5;

// check for iPhone 5, and set stuff if so
if (Titanium.Platform.displayCaps.platformHeight===568) {
	isIphone5=true;
	backgroundImage='/images/newCompass-568h@2x.png';
	degreeLabelTop=40;
	waypointBox=120;
	waypointboxmargin=10;
}

// This sets the compass update to happen every 1 degree of rotation
Titanium.Geolocation.headingFilter = 1;

// This file will help persist Position data
var pd = require('PositionData');

// What this does I am unsure
var addPoint= require('PositionData').add;

// make a couple labels to show some data
var headLabel = Ti.UI.createLabel({text:" 0°", top:degreeLabelTop, width: 150, color:'white', font : { fontSize: 48 },textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER });

// for testing
//var needleLabel=Ti.UI.createLabel({text:"needle", top:60, color: 'white' });

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//track where I think the main needle should be
var needleNow=0;
var needleGoto=0;
var heading=0;
var needleSlew=0;

//track where I think the way point needle should be
var wayneedleNow=0;
var wayneedleGoto=0;
var wayneedleSlew=0;


//make the needle image
var needleImage =Ti.UI.createImageView({
	image:'/images/needle.png'
	});
	
//make the waypoint needle image
var wayneedleImage =Ti.UI.createImageView({
	image:'/images/newwayneedle.png'
	});
	
//add waypoint info view
var waypointInfo = Ti.UI.createView({
	height:waypointBox,
	width:(Titanium.Platform.displayCaps.platformWidth-(2*waypointboxmargin)), 
	// too small on retina, just right on iphone 5, so use the margin to give a few extra pixels
	backgroundColor:'#262e2f',
	bottom: waypointboxmargin, 
	// same here - get a few extra pixels on non 5
	borderRadius: 10,
	borderColor:'black',
	borderWidth:3
	
});

var wayPointTestLabel= Ti.UI.createLabel({text:"No active waypoint", color:"black"});

waypointInfo.add(wayPointTestLabel);

// Create a 2D matrix for the main needle
var t = Ti.UI.create2DMatrix();

// Create a 2D matrix for the waypoint needle
var t2 = Ti.UI.create2DMatrix();

// Create an animation using the 2D matrix for the main needle
var a = Titanium.UI.createAnimation({transform:t});

// Create an animation using the 2D matrix for the waypoint needle
var a2 = Titanium.UI.createAnimation({transform:t});


// Whenever heading is changed, call this
var compassHandler = function(e) {
  if (e.success === undefined || e.success) {
   
  // set the heading
  heading=Math.round(e.heading.magneticHeading);

  
  // handle the main needle
  
  needleGoto=Math.abs((heading-360));
  
  if (needleNow<=needleGoto) {
  	needleSlew=(needleGoto-needleNow);  	
  } 
  
  if (needleNow>needleGoto) {
  	needleSlew=(needleGoto+(360-needleNow));
  }
  
  
  t=t.rotate(needleSlew);
  
  needleNow=needleGoto;
  needleSlew=0;
   a.transform=t;
   
   needleImage.animate(a);
   
   headLabel.text=" "+heading+"°";
  
   
   // handle the waypoint needle
   var bearing=270; // set a bearing for testing
   
   // if the heading is greater than the bearing, we must set where the needle needs to go differently
   if(heading>bearing) {
   		
   		wayneedleGoto=(360-heading)+bearing;
   	
   } else {
   		wayneedleGoto=(bearing-heading);
   }
   
   // set the label to the 
   //needleLabel.text=wayneedleGoto;

  // figure out how to animate the way needle
  if (wayneedleNow<wayneedleGoto) {
  	wayneedleSlew=(wayneedleGoto-wayneedleNow);  

  } 
  
  if (wayneedleNow>wayneedleGoto) {
  	wayneedleSlew=(wayneedleGoto+(360-wayneedleNow));
 
  }
  
  if (wayneedleNow===wayneedleGoto) {
  	wayneedleSlew=0; 
  
  }
  
 
  t2=t2.rotate(wayneedleSlew);
  
  wayneedleNow=wayneedleGoto;
  wayneedleSlew=0;
   
   a2.transform=t2;
   
   wayneedleImage.animate(a2);
   
  }
}

Ti.Geolocation.addEventListener("heading", compassHandler);

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Compass',
    backgroundColor:'#fff',
    backgroundImage:backgroundImage
});
var tab1 = Titanium.UI.createTab({  
    icon:'compass.png',
    title:'Compass',
    window:win1
});


win1.add(headLabel);
win1.add(wayneedleImage);
win1.add(waypointInfo);
//win1.add(needleLabel);
win1.add(needleImage);


// 
// Make another tab
//

//
// create controls tab and root window
//

var addButton=Ti.UI.createButton({title:"Add"});

var win3 = Titanium.UI.createWindow({  
    title:'Waypoints',
    backgroundColor:'#fff',
    rightNavButton:addButton
});
var tab3 = Titanium.UI.createTab({  
    icon:'waypoint.png',
    title:'Waypoints',
    window:win3
});

	// create table view data object
	var data = [
		{title:'Pegati Lake Outlet', wayLatitude:59.8793306, wayLongitude:-160.1266278, hasChild:true},
		{title:'Paiyun Creek', wayLatitude:59.8914972, wayLongitude:-160.3706333, hasChild:true},
		{title:'Kanuktik Creek', wayLatitude:59.8737222, wayLongitude:-160.4757, hasChild:true},
		{title:'Nakgil Creek', wayLatitude:59.854, wayLongitude:-160.6997417, hasChild:true},
		{title:'Sam Creek', wayLatitude:59.79305, wayLongitude:-160.7500778, hasChild:true},
		{title:'Klak Creek', wayLatitude:59.7805111, wayLongitude:-160.7705944, hasChild:true},
		{title:'Nukluk Creek', wayLatitude:59.7248556, wayLongitude:-160.9935833, hasChild:true},
		{title:'Kanektok Weir', wayLatitude:59.7672306, wayLongitude:-161.0606194, hasChild:true},
		{title:'Duncan Bros. Upper Camp', wayLatitude:59.8197056, wayLongitude:-161.3057944, hasChild:true},
		{title:'Duncan Bros. Lower Camp', wayLatitude:59.8076583, wayLongitude:-161.5480722, hasChild:true},
		{title:'Togiak Refuge Border', wayLatitude:59.8043667, wayLongitude:-161.5887778, hasChild:true},
		{title:'Alaska West Camp', wayLatitude:59.7794167, wayLongitude:-161.7716167, hasChild:true},
		{title:'Pull Out', wayLatitude:59.7565583, wayLongitude:-161.8846028, hasChild:true},
		{title:'On the corner', wayLatitude:37.337681, wayLongitude:-122.038193, hasChild:true},
	];
	
	var hdview=Ti.UI.createView({height:Ti.UI.SIZE,width:Ti.UI.SIZE});
	var myTestText=Ti.UI.createLabel({text:"Default waypoints",color:'white',left: 10, top:15,width:Ti.UI.SIZE,font : { fontSize: 18, fontWeight:'bold'}});
	hdview.add(myTestText);
	
	// create table view
	for (var i = 0; i < data.length; i++ ) { data[i].color = '#000'; data[i].font = {fontWeight:'bold'} };
	var tableViewOptions = {
			data:data,
			headerView:hdview,
			//headerTitle:'Default waypoints',
			//headerColor:'white',
			//backgroundImage:backgroundImage,
			backgroundColor:'#262e2f',
			rowBackgroundColor:'white'
		};
	

	tableViewOptions.style = Titanium.UI.iPhone.TableViewStyle.GROUPED;

	
	var tableview = Titanium.UI.createTableView(tableViewOptions);
	
	win3.add(tableview);
	
	
//
//
// Here is the start of the distance page ---------------------------------------->
//


var win4 = Titanium.UI.createWindow({  
    title:'Location',
    layout:'vertical',
    backgroundColor:'#262e2f'
});
var tab4 = Titanium.UI.createTab({  
    icon:'location.png',
    title:'Location',
    window:win4
});
	
// for testing the waypoint coordinate, I use this MV set instead until the math works
var endLatitude=37.337681;
var endLongitude=-122.038193;


// These should already be in the geo.js file, but should be added if not
	var longitude = 0;
	var latitude = 0;
	var altitude = 0;
	var heading = 0;
	var accuracy = 0;
	var speed = 0;
	var timestamp = 0;
	var altitudeAccuracy = 0; 

// make some labels for Mountain View TESTING
var distanceLabel=Ti.UI.createLabel({text:"You are this many miles from MV:", color:'white', top:5});
var distvalueLabel=Ti.UI.createLabel({color:'white', top:5});
var bearingLabel=Ti.UI.createLabel({text:"Waypoint bearing is degrees", color:'white', top:5});
var bearvalueLabel=Ti.UI.createLabel({color:'white', top:5});

// make some labels for the various data points for current location
var currentLocationLabel=Ti.UI.createLabel({text:"Current Location", left: 5, color:'white', top:5});
var currentLatLabel=Ti.UI.createLabel({text:"Latitude:", left: 10, color:'white', top:5});
var currentLonLabel=Ti.UI.createLabel({text:"Longitude:", left: 10, color:'white', top:5});
var currentAltLabel=Ti.UI.createLabel({text:"Altitude:", left: 10, color:'white', top:5});



	// this currently fires only once, but should be replaced with the fully functional geo.js file
	Titanium.Geolocation.getCurrentPosition(function(e) {

		if (!e.success || e.error) {
			//currentLocation.text = 'error: ' + JSON.stringify(e.error);
			//Ti.API.info("Code translation: "+translateErrorCode(e.code));
			alert('error ' + JSON.stringify(e.error));
			return;
		}

		longitude = e.coords.longitude;
		latitude = e.coords.latitude;
		altitude = e.coords.altitude;
		heading = e.coords.heading;
		accuracy = e.coords.accuracy;
		speed = e.coords.speed;
		timestamp = e.coords.timestamp;
		altitudeAccuracy = e.coords.altitudeAccuracy;

		Ti.API.info('speed ' + speed);
		//currentLocation.text = 'long:' + longitude + ' lat: ' + latitude;

		//alert('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
		Ti.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);

		// the math part should be moved to the geo.js file
		///////////////////////////////////////////
		////    BEGIN THE MATH!!!!!        ///////
		//////////////////////////////////////////
		var lat1 = latitude;
		var lon1 = longitude;
		//var lat1=37.288300;
		//var lon1=-122.89200;

		var lat2 = 37.337681;
		var lon2 = -122.038193;

		Number.prototype.toRad = function() {
			return this * Math.PI / 180;
		}

		Number.prototype.toDeg = function() {
			return this * 180 / Math.PI;
		}
		var R = 6371;
		// km
		var dLat = (lat2 - lat1).toRad();
		Ti.API.info
		var dLon = (lon2 - lon1).toRad();
		var lat1 = lat1.toRad();
		var lat2 = lat2.toRad();

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		Ti.API.info("D is: " + d);
		var miles = Math.round((d / 1.6) * 10) / 10;
		Ti.API.info("Miles is: " + miles);

		// calculate the bearing
		var y = Math.sin(dLon) * Math.cos(lat2);
		var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
		var brng = Math.atan2(y, x).toDeg();
		var bearing = Math.round(((brng + 360) % 360));

		distvalueLabel.text = (miles);
		bearvalueLabel.text = (bearing);
	}); 

			//////////////////////////////////
			///////////////  end the math ///
			/////////////////////////////////


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
currentLocationView.add(currentLocationLabel);
currentLocationView.add(currentLatLabel);
currentLocationView.add(currentLonLabel);
currentLocationView.add(currentAltLabel);

// add some labels for the pull oout section
pulloutWaypointView.add(distanceLabel);
pulloutWaypointView.add(distvalueLabel);
pulloutWaypointView.add(bearingLabel);
pulloutWaypointView.add(bearvalueLabel);


//add the info views
win4.add(currentLocationView);
win4.add(activeWaypointView);
win4.add(pulloutWaypointView);





//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab3); 
tabGroup.addTab(tab4); 


// open tab group
tabGroup.open();
