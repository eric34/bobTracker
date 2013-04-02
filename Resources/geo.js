var geo = {};
module.exports = geo;

// declare variables for position
var longitude = 0;
var latitude = 0;
var altitude = 0;
var gpsHeading = 0;
// this is the direction the device is actual moving
var accuracy = 0;
var speed = 0;
var timestamp = 0;
var altitudeAccuracy = 0;
var magneticHeading = 0;
var trueHeading = 0;
// adding this one to contain the state of the user's chosen info, "mag" for magnetic or "true" for true heading. I think all the math done for calculating distance is true'
var headingPref = 'mag';
var compHeading = 0;
// this will store the heading to use for the user to see, either the magnetic or true heading based on their choice

// Now we make the active waypoint. Cooler to make this an object, but I do not know how. :)
var activeWaypoint = false;
// This should be set by a property to persist
var activeName = 0;
var activeLat = 0;
var activeLon = 0;
var activeDist = 0;
var activeBearing = 0;

Ti.Geolocation.purpose = "Teppy TrekTracker";

geo.translateErrorCode = function(code) {
	if (code == null) {
		return null;
	}
	switch (code) {
		case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
			return "Location unknown";
		case Ti.Geolocation.ERROR_DENIED:
			return "Access denied";
		case Ti.Geolocation.ERROR_NETWORK:
			return "Network error";
		case Ti.Geolocation.ERROR_HEADING_FAILURE:
			return "Failure to detect heading";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
			return "Region monitoring access denied";
		case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
			return "Region monitoring access failure";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
			return "Region monitoring setup delayed";
	}
};
// state vars used by resume/pause
var headingAdded = false;
var locationAdded = false;

ge

//
//  SHOW CUSTOM ALERT IF DEVICE HAS GEO TURNED OFF
//
if (Titanium.Geolocation.locationServicesEnabled === false) {
	Titanium.UI.createAlertDialog({
		title : 'Teppy Trek',
		message : 'Your device has geo turned off - turn it on.'
	}).show();
} else {
	if (Titanium.Platform.name != 'android') {

		// commenting this out. First referred to "win" and I updated that, but at this point the windows are undefined.
		// if (ui.compassWindow.openedflag == 0) {
		// Ti.API.info('firing open event');
		// win.fireEvent('open');
		// }
		// if (ui.compassWindow.focusedflag == 0) {
		// Ti.API.info('firing focus event');
		// win.fireEvent('focus');
		// }
		var authorization = Titanium.Geolocation.locationServicesAuthorization;
		Ti.API.info('Authorization: ' + authorization);
		if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
			Ti.UI.createAlertDialog({
				title : 'Teppy Trek',
				message : 'You have disallowed Teppy Trek from running geolocation services.'
			}).show();
		} else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
			Ti.UI.createAlertDialog({
				title : 'Teppy Trek',
				message : 'Your system has disallowed Teppy Trek from running geolocation services.'
			}).show();
		}
	}

	//
	// IF WE HAVE COMPASS GET THE HEADING
	//
	if (Titanium.Geolocation.hasCompass) {
		//
		//  TURN OFF ANNOYING COMPASS INTERFERENCE MESSAGE
		//
		Titanium.Geolocation.showCalibration = false;

		//
		// SET THE HEADING FILTER (THIS IS IN DEGREES OF ANGLE CHANGE)
		// EVENT WON'T FIRE UNLESS ANGLE CHANGE EXCEEDS THIS VALUE
		Titanium.Geolocation.headingFilter = 1;

		//
		//  GET CURRENT HEADING - THIS FIRES ONCE
		//
		Ti.Geolocation.getCurrentHeading(function(e) {
			if (e.error) {
				// I don't have this text object
				//currentHeading.text = 'error: ' + e.error;
				Ti.API.info("Code translation: " + geo.translateErrorCode(e.code));
				return;
			}

			magneticHeading = e.heading.magneticHeading;
			accuracy = e.heading.accuracy;
			trueHeading = e.heading.trueHeading;
			timestamp = e.heading.timestamp;

			// set the labels - if the user wants magnetic, use magnetic
			if (headingPref === 'mag') {
				compHeading = Math.round(magneticHeading);
			} else {
				// or they want true
				compHeading = Math.round(trueHeading);
			}

			ui.headLabel.text = " " + compHeading + "°";

			//Titanium.API.info('geo - current heading: ' + new Date(timestamp));
		});

		//
		// EVENT LISTENER FOR COMPASS EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON HEADING FILTER)
		//
		var headingCallback = function(e) {
			if (e.error) {
				// I don't have this text object
				//updatedHeading.text = 'error: ' + e.error;
				Ti.API.info("Code translation: " + geo.translateErrorCode(e.code));
				return;
			}

			magneticHeading = e.heading.magneticHeading;
			accuracy = e.heading.accuracy;
			trueHeading = e.heading.trueHeading;
			timestamp = e.heading.timestamp;

			// Eric's addition is here: maybe combine this and the one-shot function above to be one label-update mechanism
			// set the labels - if the user wants magnetic, use magnetic
			if (headingPref === 'mag') {
				compHeading = Math.round(magneticHeading);
			} else {
				// or they want true
				compHeading = Math.round(trueHeading);
			}

			ui.headLabel.text = " " + compHeading + "°";

			//Titanium.API.info('geo - heading updated: ' + new Date(timestamp));
		};
		Titanium.Geolocation.addEventListener('heading', headingCallback);
		headingAdded = true;
	} else {
		Titanium.API.info("No Compass on device");
	}

	//
	//  SET ACCURACY - THE FOLLOWING VALUES ARE SUPPORTED
	//
	// Titanium.Geolocation.ACCURACY_BEST
	// Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS
	// Titanium.Geolocation.ACCURACY_HUNDRED_METERS
	// Titanium.Geolocation.ACCURACY_KILOMETER
	// Titanium.Geolocation.ACCURACY_THREE_KILOMETERS
	//
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

	//
	//  SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVES
	//  THIS VALUE IS IN METERS
	//
	Titanium.Geolocation.distanceFilter = 3;

	//
	// GET CURRENT POSITION - THIS FIRES ONCE
	//
	// ---------------------- > from here I have to make this a callable function from the windows themselves.
	ui.compassWindow.addEventListener('open', function() {
		ui.compassWindow.openedflag = 1;
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				currentLocation.text = 'error: ' + JSON.stringify(e.error);
				Ti.API.info("Code translation: " + geo.translateErrorCode(e.code));
				alert('error ' + JSON.stringify(e.error));
				return;
			}

			longitude = e.coords.longitude;
			latitude = e.coords.latitude;
			altitude = e.coords.altitude;
			gpsHeading = e.coords.heading;
			accuracy = e.coords.accuracy;
			speed = e.coords.speed;
			timestamp = e.coords.timestamp;
			altitudeAccuracy = e.coords.altitudeAccuracy;
			Ti.API.info('speed ' + speed);

			// set the info in the location screen
			ui.currentLatLabel.text = ("Latitude: " + latitude);
			ui.currentLonLabel.text = ("Longitude: " + longitude);
			ui.currentAltLabel.text = ("Altitude: " + altitude);
			ui.currentSpeedLabel.text = ("Speed: " + speed);
			ui.currentGPSHeadLabel.text = ("Moving: " + gpsHeading);

			Titanium.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
		});
	});

	//
	// EVENT LISTENER FOR GEO EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON DISTANCE FILTER)
	//
	var locationCallback = function(e) {

		// commented this part out because it is looking for "win" again
		// //Forcing a window open and focus event.
		// if (win.openedflag == 0) {
		// Ti.API.info('firing open event');
		// win.fireEvent('open');
		// }
		// if (win.focusedflag == 0) {
		// Ti.API.info('firing focus event');
		// win.fireEvent('focus');
		// }
		// if (!e.success || e.error) {
		// updatedLocation.text = 'error:' + JSON.stringify(e.error);
		// updatedLatitude.text = '';
		// updatedLocationAccuracy.text = '';
		// updatedLocationTime.text = '';
		// Ti.API.info("Code translation: " + translateErrorCode(e.code));
		// return;
		// }
		
		// a temporary fix to the runtime exception
		if(e.success) {
			longitude = e.coords.longitude;
			latitude = e.coords.latitude;
			altitude = e.coords.altitude;
			gpsHeading = e.coords.heading;
			accuracy = e.coords.accuracy;
			speed = e.coords.speed;
			timestamp = e.coords.timestamp;
			altitudeAccuracy = e.coords.altitudeAccuracy;	
		}
		

		// set the info in the location screen
		ui.currentLatLabel.text = ("Latitude: " + latitude);
		ui.currentLonLabel.text = ("Longitude: " + longitude);
		ui.currentAltLabel.text = ("Altitude: " + altitude);
		ui.currentSpeedLabel.text = ("Speed: " + speed);
		ui.currentGPSHeadLabel.text = ("Moving: " + gpsHeading);

		Titanium.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
	};
	Titanium.Geolocation.addEventListener('location', locationCallback);
	locationAdded = true;

}

////////   ------------>>>   Here I will try to make the math into a function

// first the prototypes.
Number.prototype.toRad = function() {
	return this * Math.PI / 180;
}

Number.prototype.toDeg = function() {
	return this * 180 / Math.PI;
}
///   now the distance formula
geo.distanceCheck = function(lat1, lon1, lat2, lon2) {
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
	var miles = Math.round((d / 1.6) * 10) / 10;
	Ti.API.info("Miles is: " + miles);

	return miles;

}
// and the bearing formula
geo.bearingCheck = function(lat1, lon1, lat2, lon2) {
	// calculate the bearing
	var dLon = (lon2 - lon1).toRad();
	var y = Math.sin(dLon) * Math.cos(lat2);
	var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
	var brng = Math.atan2(y, x).toDeg();
	var bearing = Math.round(((brng + 360) % 360));

	return bearing;
}
// ---------------------- > from here I have to make these callable functions from the windows themselves.
// the variables used as window properties for these is:
// win.openedflag = 0 ;
// win.focusedflag = 0;

/* wluu:
*
* you want to do something like this:
* geo.listeningTo(win) {
* 		win.addEventListener('focus', function() {...});
* }
*
*/

// win.addEventListener('focus', function() {
// win.focusedflag = 1;
// Ti.API.info("focus event received");
// if (!headingAdded && headingCallback) {
// Ti.API.info("adding heading callback on resume");
// Titanium.Geolocation.addEventListener('heading', headingCallback);
// headingAdded = true;
// }
// if (!locationAdded && locationCallback) {
// Ti.API.info("adding location callback on resume");
// Titanium.Geolocation.addEventListener('location', locationCallback);
// locationAdded = true;
// }
//
// });
//
// /* wluu:
// *
// * you want to do something like this:
// * geo.stopListeningTo(win) {
// * 		win.addEventListener('blur', function() {...});
// * }
// *
// */
// win.addEventListener('blur', function() {
// Ti.API.info("pause event received");
// if (headingAdded) {
// Ti.API.info("removing heading callback on pause");
// Titanium.Geolocation.removeEventListener('heading', headingCallback);
// headingAdded = false;
// }
// if (locationAdded) {
// Ti.API.info("removing location callback on pause");
// Titanium.Geolocation.removeEventListener('location', locationCallback);
// locationAdded = false;
// }
// });

