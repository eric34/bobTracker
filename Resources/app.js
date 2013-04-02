// Require external files first; similar practice to Java's import or C++ include
var ui = require('ui');
var pd = require('PositionData');

ui.defaultWaypoints = pd.defaultWaypoints();

var mainTabGroup = ui.makeApplicationTabgroup();
mainTabGroup.open();

// this is almost ready to go:
var geo = require('geo');

// This sets the compass update to happen every 1 degree of rotation
//Titanium.Geolocation.headingFilter = 1;

// // Now we make the active waypoint. Cooler to make this an object, but I do not know how. :)
// var activeWaypoint = false;  // THis should be set by a property to persist
// var activeName = 0;
// var activeLat = 0;
// var activeLon = 0;
// var activeDist = 0;
// var activeBearing = 0;

// //track where I think the main needle should be
// var needleNow = 0;
// var needleGoto = 0;
// var heading = 0;
// var needleSlew = 0;
//
// //track where I think the way point needle should be
// var wayneedleNow = 0;
// var wayneedleGoto = 0;
// var wayneedleSlew = 0;
//
// // Create a 2D matrix for the main needle
// var t = Ti.UI.create2DMatrix();
//
// // Create a 2D matrix for the waypoint needle
// var t2 = Ti.UI.create2DMatrix();
//
// // Create an animation using the 2D matrix for the main needle
// var a = Titanium.UI.createAnimation({
// transform : t
// });
//
// // Create an animation using the 2D matrix for the waypoint needle
// var a2 = Titanium.UI.createAnimation({
// transform : t
// });

// // Whenever heading is changed, call this
// var compassHandler = function(e) {
// if (e.success === undefined || e.success) {

// // set the heading
// heading = Math.round(e.heading.magneticHeading);
//
// // handle the main needle
//
// needleGoto = Math.abs((heading - 360));
//
// if (needleNow <= needleGoto) {
// needleSlew = (needleGoto - needleNow);
// }
//
// if (needleNow > needleGoto) {
// needleSlew = (needleGoto + (360 - needleNow));
// }
//
// t = t.rotate(needleSlew);
//
// needleNow = needleGoto;
// needleSlew = 0;
// a.transform = t;
//
// ui.needleImage.animate(a);
//
// ui.headLabel.text = " " + heading + "°";
//
// //////////////////////////////////////
// // handle the waypoint needle    ////
// ////////////////////////////////////
//
// // check if there is an active waypoint
// if (activeWaypoint) {
// var bearing = activeBearing;
// // set a bearing for testing
//
// // if the heading is greater than the bearing, we must set where the needle needs to go differently
// if (heading > bearing) {
//
// wayneedleGoto = (360 - heading) + bearing;
//
// } else {
// wayneedleGoto = (bearing - heading);
// }
//
// // figure out how to animate the way needle
// if (wayneedleNow < wayneedleGoto) {
// wayneedleSlew = (wayneedleGoto - wayneedleNow);
//
// }
//
// if (wayneedleNow > wayneedleGoto) {
// wayneedleSlew = (wayneedleGoto + (360 - wayneedleNow));
//
// }
//
// if (wayneedleNow === wayneedleGoto) {
// wayneedleSlew = 0;
//
// }
//
// t2 = t2.rotate(wayneedleSlew);
//
// wayneedleNow = wayneedleGoto;
// wayneedleSlew = 0;
//
// a2.transform = t2;
//
// ui.wayneedleImage.animate(a2);
// }
//
// }
// }

//Ti.Geolocation.addEventListener("heading", compassHandler);

// for testing the waypoint coordinate, I use this MV set instead until the math works
var endLatitude = 37.337681;
var endLongitude = -122.038193;

// // These should already be in the geo.js file, but should be added if not
// var longitude = 0;
// var latitude = 0;
// var altitude = 0;
// var heading = 0;
// var accuracy = 0;
// var speed = 0;
// var timestamp = 0;
// var altitudeAccuracy = 0;
// var lat1 = 0;
// var lon1 = 0;
// var lat2 = 0;
// var lon2 = 0;

// // this currently fires only once, but should be replaced with the fully functional geo.js file
// Titanium.Geolocation.getCurrentPosition(function(e) {
//
// if (!e.success || e.error) {
// //currentLocation.text = 'error: ' + JSON.stringify(e.error);
// //Ti.API.info("Code translation: "+translateErrorCode(e.code));
// alert('error ' + JSON.stringify(e.error));
// return;
// }
//
// longitude = e.coords.longitude;
// latitude = e.coords.latitude;
// altitude = e.coords.altitude;
// heading = e.coords.heading;
// accuracy = e.coords.accuracy;
// speed = e.coords.speed;
// timestamp = e.coords.timestamp;
// altitudeAccuracy = e.coords.altitudeAccuracy;
//
//
// // set the info in the location screen
// ui.currentLatLabel.text = ("Latitude: "+latitude);
// ui.currentLonLabel.text = ("Longitude: "+longitude);
// ui.currentAltLabel.text = ("Altitude: "+altitude);
//
//
// Ti.API.info('speed ' + speed);
// //currentLocation.text = 'long:' + longitude + ' lat: ' + latitude;
//
// //alert('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
// Ti.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);

// the math part should be moved to the geo.js file
// ///////////////////////////////////////////
// ////    BEGIN THE MATH!!!!!        ///////
// //////////////////////////////////////////
// lat1 = latitude;
// lon1 = longitude;
//
// lat2 = activeLat;
// lon2 = activeLon;
//
// //var lat1=37.288300;
// //var lon1=-122.89200;
// //var lat2 = 37.337681;
// //var lon2 = -122.038193;
//
// Number.prototype.toRad = function() {
// return this * Math.PI / 180;
// }
//
// Number.prototype.toDeg = function() {
// return this * 180 / Math.PI;
// }
// var R = 6371;
// // km
// var dLat = (lat2 - lat1).toRad();
// var dLon = (lon2 - lon1).toRad();
// var lat1 = lat1.toRad();
// var lat2 = lat2.toRad();
//
// var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
// var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// var d = R * c;
// Ti.API.info("D is: " + d);
// var miles = Math.round((d / 1.6) * 10) / 10;
// Ti.API.info("Miles is: " + miles);
//
// // calculate the bearing
// var y = Math.sin(dLon) * Math.cos(lat2);
// var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
// var brng = Math.atan2(y, x).toDeg();
// var bearing = Math.round(((brng + 360) % 360));
// activeBearing = bearing;
// activeDist = miles;
// // distvalueLabel.text = (miles);
// // bearvalueLabel.text = (bearing);
// // This will be an example of using the ui element in another file
// ui.distvalueLabel.text = (miles);
// ui.bearvalueLabel.text = (bearing);
// });
//////////////////////////////////
///////////////  end the math ///
/////////////////////////////////
