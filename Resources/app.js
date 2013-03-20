


// THis is the fancy part I need to implement
//var geo= require('geo');
// geo.oneShot();


// This is for iOS to know why we are asking for location data
Ti.Geolocation.purpose = "GPS Location Finding";

// This sets the compass update to happen every 1 degree of rotation
Titanium.Geolocation.headingFilter = 1;

// This file will help persist Position data
var pd = require('PositionData');

// What this does I am unsure
var addPoint= require('PositionData').add;

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
		heading = Math.round(e.heading.magneticHeading);

		// handle the main needle

		needleGoto = Math.abs((heading - 360));

		if (needleNow <= needleGoto) {
			needleSlew = (needleGoto - needleNow);
		}

		if (needleNow > needleGoto) {
			needleSlew = (needleGoto + (360 - needleNow));
		}

		t = t.rotate(needleSlew);

		needleNow = needleGoto;
		needleSlew = 0;
		a.transform = t;

		needleImage.animate(a);

		headLabel.text = " " + heading + "°";

		// handle the waypoint needle
		var bearing = 270;
		// set a bearing for testing

		// if the heading is greater than the bearing, we must set where the needle needs to go differently
		if (heading > bearing) {

			wayneedleGoto = (360 - heading) + bearing;

		} else {
			wayneedleGoto = (bearing - heading);
		}

		// set the label to the
		//needleLabel.text=wayneedleGoto;

		// figure out how to animate the way needle
		if (wayneedleNow < wayneedleGoto) {
			wayneedleSlew = (wayneedleGoto - wayneedleNow);

		}

		if (wayneedleNow > wayneedleGoto) {
			wayneedleSlew = (wayneedleGoto + (360 - wayneedleNow));

		}

		if (wayneedleNow === wayneedleGoto) {
			wayneedleSlew = 0;

		}

		t2 = t2.rotate(wayneedleSlew);

		wayneedleNow = wayneedleGoto;
		wayneedleSlew = 0;

		a2.transform = t2;

		wayneedleImage.animate(a2);

	}
}


Ti.Geolocation.addEventListener("heading", compassHandler);

// this require is only used for testing
// require should be declared at the beginning of the file
var ui = require('ui');
var tab1 = Titanium.UI.createTab({  
    icon:'compass.png',
    title:'Compass',
    window:ui.makeCompassWindow()
});


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
	
	
var endLatitude=37.337681;
var endLongitude=-122.038193;


// make some labels
var distanceLabel=Ti.UI.createLabel({text:"You are this many miles from MV:", color:'white', top:30});
var distvalueLabel=Ti.UI.createLabel({color:'white', top:10});
var bearingLabel=Ti.UI.createLabel({text:"Waypoint bearing is degrees", color:'white', top:50});
var bearvalueLabel=Ti.UI.createLabel({color:'white', top:10});

//var currentLocation=Ti.UI.createLabel({text:"Current", top:30});

Titanium.Geolocation.getCurrentPosition(function(e)
			{
				
				if (!e.success || e.error)
				{
					//currentLocation.text = 'error: ' + JSON.stringify(e.error);
					//Ti.API.info("Code translation: "+translateErrorCode(e.code));
					alert('error ' + JSON.stringify(e.error));
					return;
				}
		
				var longitude = e.coords.longitude;
				var latitude = e.coords.latitude;
				var altitude = e.coords.altitude;
				var heading = e.coords.heading;
				var accuracy = e.coords.accuracy;
				var speed = e.coords.speed;
				var timestamp = e.coords.timestamp;
				var altitudeAccuracy = e.coords.altitudeAccuracy;
				
				Ti.API.info('speed ' + speed);
				//currentLocation.text = 'long:' + longitude + ' lat: ' + latitude;
			
				alert('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
			

				///////////////////////////////////////////
				////    BEGIN THE MATH!!!!!        ///////
				//////////////////////////////////////////
				var lat1=latitude;
				var lon1=-longitude;
				//var lat1=37.288300;
				//var lon1=-122.89200;
				
				var lat2=37.337681;
				var lon2=-122.038193;
				
				Number.prototype.toRad = function() {
				   return this * Math.PI / 180;
				}
				
				Number.prototype.toDeg = function() {
				   return this * 180 / Math.PI;
				}
				
					
				var R = 6371; // km
				var dLat = (lat2-lat1).toRad();
				var dLon = (lon2-lon1).toRad();
				var lat1 = lat1.toRad();
				var lat2 = lat2.toRad();
				
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				var d = R * c;
				alert(d);
				var miles = (d/1.6);
				
				// calculate the bearing
				var y = Math.sin(dLon) * Math.cos(lat2);
				var x = Math.cos(lat1)*Math.sin(lat2) -
				        Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
				var brng = Math.atan2(y, x).toDeg();
				var bearing=(brng+360) % 360; 
				
				distvalueLabel.text=(miles);
				bearvalueLabel.text=(bearing);
			});


///////////////  end the math //////////////////
/////////////////////////////////


//var distanceLabel=Ti.UI.createLabel({text:"You are "+miles+" miles from MV", top:50});
//var bearingLabel=Ti.UI.createLabel({text:"Waypoint bearing is "+brng+" degrees", top:50});

// add some labels
//win4.add(currentLocation);
win4.add(distanceLabel);
win4.add(distvalueLabel);
win4.add(bearingLabel);
win4.add(bearvalueLabel);



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab3); 
tabGroup.addTab(tab4); 


// open tab group
tabGroup.open();
