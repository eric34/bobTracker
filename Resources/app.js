// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// This is for iOS to know why we are asking for location data
Ti.Geolocation.purpose = "GPS Location Finding";

// This sets the compass update to happen every 1 degree of rotation
Titanium.Geolocation.headingFilter = 1;

// This file will help persist Position data
var pd = require('PositionData');

// What this does I am unsure
var addPoint= require('PositionData').add;

// add logic here to set image, currently only iPhone 4
var backgroundImage='/images/newCompass@2x.png';

// make a couple labels to show some data
var headLabel = Ti.UI.createLabel({text:"0°", top:10, width: 150, color:'white', font : { fontSize: 48 },textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER });

//
var needleLabel=Ti.UI.createLabel({text:"needle", top:60, color: 'white' });


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
var wayNeedle =Ti.UI.createImageView({
	image:'/images/wayNeedle.png'
	});
	

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
   
  
  // handle the main needle
  // set the heading
  heading=Math.round(e.heading.magneticHeading);
  
  needleGoto=Math.abs((heading-360));
  
  if (needleNow<needleGoto) {
  	needleSlew=(needleGoto-needleNow);  	
  } 
  
  if (needleNow>needleGoto) {
  	needleSlew=(needleGoto+(360-needleNow));
  }
  
  if (needleNow===needleGoto) {
  	needleSlew=0; 	
  }
  
  t=t.rotate(needleSlew);
  
  needleNow=needleGoto;
  needleSlew=0;
   a.transform=t;
   
   needleImage.animate(a);
   
   headLabel.text=heading+" °";
  
   
   // handle the waypoint needle
   var bearing=270; // set a bearing for testing
   
   wayneedleGoto=Math.abs((heading-360));
  
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
    icon:'KS_nav_views.png',
    title:'Compass',
    window:win1
});


win1.add(headLabel);
win1.add(wayNeedle);
//win1.add(needleLabel);
win1.add(needleImage);

// 
// Make another tab
//

//
// create controls tab and root window
//
var win3 = Titanium.UI.createWindow({  
    title:'Tab 3',
    backgroundColor:'#fff'
});
var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Tab 3',
    window:win3
});

	// create table view data object
	var data = [
		{title:'Basic', hasChild:true, test:'ui/common/baseui/table_view_basic', header:'Simple Table API'},
		{title:'Performance', hasChild:true, test:'ui/common/baseui/table_view_perf'},
		{title:'Custom Row Data', hasChild:true, test:'ui/common/baseui/table_view_custom_rowdata'},
		{title:'Headers', hasChild:true, test:'ui/common/baseui/table_view_headers'},
		{title:'Footers', hasChild:true, test:'ui/common/baseui/table_view_footers'},
		{title:'Table API Basic', hasChild:true, test:'ui/common/baseui/table_view_api_basic', header:'New Programmatic API'},
		{title:'Table Custom Row Header', hasChild:true, test:'ui/common/baseui/table_view_api_custom_rowheader'},
		{title:'Table Section Header', hasChild:true, test:'ui/common/baseui/table_view_section_header'},
		{title:'Table Empty Dataset (Create)', hasChild:true, test:'ui/common/baseui/table_view_api_emptydata'},
		{title:'Append Row', hasChild:true, test:'ui/common/baseui/table_view_row_append'},
		{title:'Delete Row', hasChild:true, test:'ui/common/baseui/table_view_row_delete'},
		{title:'Insert Row', hasChild:true, test:'ui/common/baseui/table_view_row_insert'},
		{title:'Update Row', hasChild:true, test:'ui/common/baseui/table_view_row_update'},
		{title:'Set Row Data', hasChild:true, test:'ui/common/baseui/table_view_set'},
		{title:'Row data from sections', hasChild:true, test:'ui/common/baseui/table_view_api_sections'},
		{title:'Remove all rows', hasChild:true, test:'ui/common/baseui/table_view_removeall'},
		{title:'Empty Table View', hasChild:true, test:'ui/common/baseui/table_view_empty'},
		{title:'Table Auto Height', hasChild:true, test:'ui/common/baseui/table_view_api_auto_height'},
		{title:'Refresh Table View', hasChild:true, test:'ui/common/baseui/table_view_refresh'},
		{title:'Table View Scroll Indicators', hasChild:true, test:'ui/common/baseui/table_view_scroll_indicators'},
		{title:'Composite (Partial Size)', hasChild:true, test:'ui/common/baseui/table_view_composite'},
		{title:'Table View (Layout)', hasChild:true, test:'ui/common/baseui/table_view_layout'},
		{title:'Table View (Layout 2)', hasChild:true, test:'ui/common/baseui/table_view_layout_2'}
	];
	
	// create table view
	for (var i = 0; i < data.length; i++ ) { data[i].color = '#000'; data[i].font = {fontWeight:'bold'} };
	var tableViewOptions = {
			data:data,
			headerTitle:'TableView examples and test cases',
			footerTitle:"Wow. That was cool!",
			backgroundColor:'transparent',
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
    title:'Tab 4',
    layout:'vertical',
    backgroundColor:'#fff'
});
var tab4 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Tab 4',
    window:win4
});
	
	
var endLatitude=37.337681;
var endLongitude=-122.038193;

var longitude = 0;
var latitude = 0;
var altitude = 0;
var heading = 0;
var speed = 0;
var accuracy = 0;
var timestamp = 0;
var altitudeAccuracy=0;


var currentLocation=Ti.UI.createLabel({text:"Current", top:30});

Titanium.Geolocation.getCurrentPosition(function(e)
			{
				if (!e.success || e.error)
				{
					//currentLocation.text = 'error: ' + JSON.stringify(e.error);
					Ti.API.info("Code translation: "+translateErrorCode(e.code));
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
				currentLocation.text = 'long:' + longitude + ' lat: ' + latitude;
			
				Titanium.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
			});

///////////////////////////////////////////
////    BEGIN THE MATH!!!!!        ///////
//////////////////////////////////////////
var lat1=37.287914;
var lon1=-121.892295;

var lat2=37.288217;
var lon2=-121.89191;

Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

Number.prototype.toDeg = function() {
   return this * 180 / Math.PI;
}

function calcDistance(lat1, lon1, lat2, lon2){
	
var R = 6371; // km
var dLat = (lat2-lat1).toRad();
var dLon = (lon2-lon1).toRad();
var lat1 = lat1.toRad();
var lat2 = lat2.toRad();

var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
var d = R * c;
var miles = (d/1.6);

// calculate the bearing
var y = Math.sin(dLon) * Math.cos(lat2);
var x = Math.cos(lat1)*Math.sin(lat2) -
        Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
var brng = Math.atan2(y, x).toDeg();
var bearing=(brng+360) % 360; 

return [miles, bearing];


}

///////////////  end the math //////////////////
/////////////////////////////////

var distanceLabel=Ti.UI.createLabel({text:"You are Kilometers from MV", top:50});
//var distanceLabel=Ti.UI.createLabel({text:"You are "+miles+" miles from MV", top:50});
//var bearingLabel=Ti.UI.createLabel({text:"Head for "+brng+" degrees", top:50});

// add some labels
//win4.add(currentLocation);
//win4.add(distanceLabel);
//win4.add(bearingLabel);



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab3); 
tabGroup.addTab(tab4); 


// open tab group
tabGroup.open();
