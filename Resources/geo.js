var geo = {};
module.exports = geo;

// declare variables for position
geo.longitude = 0;
geo.latitude = 0;
geo.altitude = 0;
geo.gpsHeading = 0;  // this is the direction the device is actually moving
geo.accuracy = 0;
geo.compAccuracy = 0;
geo.speed = 0;
geo.timestamp = 0;
geo.altitudeAccuracy = 0;
geo.magneticHeading = 0;
geo.trueHeading = 0;

// adding this one to contain the state of the user's chosen info, "mag" for magnetic or "true" for true heading. I think all the math done for calculating distance is true'
geo.headingPref = 'true';
geo.compHeading = 0;
// this will store the heading to use for the user to see, either the magnetic or true heading based on their choice

// Now we make the active waypoint. Cooler to make this an object, but I do not know how. :)
geo.activeWaypoint = false;  // This should be set by a property to persist
geo.activeName = 0;
geo.activeLat = 0;
geo.activeLon = 0;
geo.activeDist = 0;
geo.activeBearing = 0;

// state vars used by resume/pause
var headingAdded = false;
var locationAdded = false;


// set a bunch of stuff related to GPS and compass
Ti.Geolocation.purpose = "Teppy TrekTracker"; // set for iOS 3 something and higher
Ti.Geolocation.showCalibration = false; //  TURN OFF ANNOYING COMPASS INTERFERENCE MESSAGE
Titanium.Geolocation.headingFilter = 1; // SET THE HEADING FILTER (THIS IS IN DEGREES OF ANGLE CHANGE) EVENT WON'T FIRE UNLESS ANGLE CHANGE EXCEEDS THIS VALUE
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST; // Set the GPS accuracy I want
Titanium.Geolocation.distanceFilter = 3; //SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVes IN METERS


// Error code function when stuff breaks
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


//  SHOW CUSTOM ALERT IF DEVICE HAS GEO TURNED OFF
geo.isEnabled = function() {
	var message = '';
	var locationEnabled = true;
	
	if (!Titanium.Geolocation.locationServicesEnabled) {
		message = 'Your device has geo turned off - turn it on.';
	}
	else {
		
		switch (Titanium.Geolocation.locationServicesAuthorization) {
			
		case Titanium.Geolocation.AUTHORIZATION_DENIED:
			message = 'You have disallowed Teppy Trek from running geolocation services.';
			break;
		case Titanium.Geolocation.AUTHORIZATION_RESTRICTED:
			message = 'Your system has disallowed Teppy Trek from running geolocation services.';
			break;
			
		}
	}
	
	if (message.length !== 0) {
		Titanium.UI.createAlertDialog({
		title : 'Teppy Trek',
		message : message
		}).show();
		
		locationEnabled = false;	
	}
	
	return locationEnabled;
};

//
// IF WE HAVE COMPASS, GET THE HEADING
//
geo.checkCompass = function() {
	if (Titanium.Geolocation.hasCompass) {

		var headingCallback = function(e) {
			if (e.error) {
				ui.headLabel.text = 'error: ' + e.error;
				Ti.API.info("Code translation: " + geo.translateErrorCode(e.code));
				return;
			}

			geo.magneticHeading = e.heading.magneticHeading;
			geo.compAccuracy = e.heading.accuracy;
			geo.trueHeading = e.heading.trueHeading;
			geo.timestamp = e.heading.timestamp;

			
			// wluu: might want to use this logic only with getCurrentHeading
			// Eric: what? You smoking something over there?
			
			// set the labels - if the user wants magnetic, use magnetic
			if (geo.headingPref === 'mag') {
				geo.compHeading = Math.round(geo.magneticHeading);
			} else {
				// or they want true
				geo.compHeading = Math.round(geo.trueHeading);
			}
			
			// run the function to animate and update the heading label
			anim.mainNeedleAnimate();
			anim.wayNeedleAnimate();
			
			// Shouldn't need this
			// ui.headLabel.text = " " + geo.compHeading + "°";

			//Titanium.API.info('geo - heading updated: ' + new Date(timestamp));
		};

		//
		//  GET CURRENT HEADING - THIS FIRES ONCE
		//
		Ti.Geolocation.getCurrentHeading(headingCallback);

		//
		// EVENT LISTENER FOR COMPASS EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON HEADING FILTER)
		//
		Titanium.Geolocation.addEventListener('heading', headingCallback);
		//headingAdded = true; 

	} 
};

// check the GPS
geo.checkGPS = function() {

	ui.compassWindow.addEventListener('open', function() {
		ui.compassWindow.openedflag = 1;
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				currentLocation.text = 'error: ' + JSON.stringify(e.error);
				Ti.API.info("Code translation: " + geo.translateErrorCode(e.code));
				alert('error ' + JSON.stringify(e.error));
				return;
			}

			geo.longitude = e.coords.longitude;
			geo.latitude = e.coords.latitude;
			geo.altitude = Math.round(e.coords.altitude);
			geo.gpsHeading = Math.round(((e.coords.heading + 360) % 360));
			geo.accuracy = e.coords.accuracy;
			geo.speed = Math.round((e.coords.speed) * 10) / 10;
			geo.timestamp = e.coords.timestamp;
			geo.altitudeAccuracy = e.coords.altitudeAccuracy;	
			//Ti.API.info('speed ' + speed);

			// set the info in the location screen
			ui.currentLatLabel.text = ("Latitude: " + geo.latitude);
			ui.currentLonLabel.text = ("Longitude: " + geo.longitude);
			ui.currentAltLabel.text = ("Altitude: " + geo.altitude);
			ui.currentSpeedLabel.text = ("Speed: " + geo.speed);
			ui.currentGPSHeadLabel.text = ("Moving: " + geo.gpsHeading);

			//Titanium.API.info('geo - current location: ' + new Date(geo.timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
		});
	});

	//
	// EVENT LISTENER FOR GEO EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON DISTANCE FILTER)
	//
	var locationCallback = function(e) {

		// a temporary fix to the runtime exception
		if (e.success) {
			geo.longitude = e.coords.longitude;
			geo.latitude = e.coords.latitude;
			geo.altitude = Math.round(e.coords.altitude);
			geo.gpsHeading = Math.round(((e.coords.heading + 360) % 360));
			geo.accuracy = e.coords.accuracy;
			geo.speed = Math.round((e.coords.speed) * 10) / 10;
			geo.timestamp = e.coords.timestamp;
			geo.altitudeAccuracy = e.coords.altitudeAccuracy;
		}

		// set the info in the location screen
		ui.currentLatLabel.text = ("Latitude: " + geo.latitude);
		ui.currentLonLabel.text = ("Longitude: " + geo.longitude);
		ui.currentAltLabel.text = ("Altitude: " + geo.altitude);
		ui.currentSpeedLabel.text = ("Speed: " + geo.speed);
		ui.currentGPSHeadLabel.text = ("Moving: " + geo.gpsHeading);
		
		// check the distance to the selected waypoint
		

		//Titanium.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
	};
	Titanium.Geolocation.addEventListener('location', locationCallback);
	locationAdded = true;

	// }

};






// if (Titanium.Geolocation.locationServicesEnabled === false) {
	// Titanium.UI.createAlertDialog({
		// title : 'Teppy Trek',
		// message : 'Your device has geo turned off - turn it on.'
	// }).show();
// } else {
	//if (Titanium.Platform.name != 'android') {

		// commenting this out. First referred to "win" and I updated that, but at this point the windows are undefined.
		// if (ui.compassWindow.openedflag == 0) {
		// Ti.API.info('firing open event');
		// win.fireEvent('open');
		// }
		// if (ui.compassWindow.focusedflag == 0) {
		// Ti.API.info('firing focus event');
		// win.fireEvent('focus');
		// }
		
		
		// var authorization = Titanium.Geolocation.locationServicesAuthorization;
		// Ti.API.info('Authorization: ' + authorization);
		// if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
			// Ti.UI.createAlertDialog({
				// title : 'Teppy Trek',
				// message : 'You have disallowed Teppy Trek from running geolocation services.'
			// }).show();
		// } else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
			// Ti.UI.createAlertDialog({
				// title : 'Teppy Trek',
				// message : 'Your system has disallowed Teppy Trek from running geolocation services.'
			// }).show();
		// }
	// }

	//
	// IF WE HAVE COMPASS GET THE HEADING
	//
	// if (Titanium.Geolocation.hasCompass) {
		// //
		// //  TURN OFF ANNOYING COMPASS INTERFERENCE MESSAGE
		// //
		// Titanium.Geolocation.showCalibration = false;
// 
		// //
		// // SET THE HEADING FILTER (THIS IS IN DEGREES OF ANGLE CHANGE)
		// // EVENT WON'T FIRE UNLESS ANGLE CHANGE EXCEEDS THIS VALUE
		// Titanium.Geolocation.headingFilter = 1;
// 		
		// var headingCallback = function(e) {
			// if (e.error) {
				// // I don't have this text object
				// // wluu: you can replace this with ui.headLabel
				// //updatedHeading.text = 'error: ' + e.error;
				// Ti.API.info("Code translation: " + geo.translateErrorCode(e.code));
				// return;
			// }
// 
			// magneticHeading = e.heading.magneticHeading;
			// accuracy = e.heading.accuracy;
			// trueHeading = e.heading.trueHeading;
			// timestamp = e.heading.timestamp;
// 
			// // Eric's addition is here: maybe combine this and the one-shot function above to be one label-update mechanism
			// // set the labels - if the user wants magnetic, use magnetic
			// // wluu: might want to use this logic only with getCurrentHeading
			// if (geo.headingPref === 'mag') {
				// geo.compHeading = Math.round(magneticHeading);
			// } else {
				// // or they want true
				// geo.compHeading = Math.round(trueHeading);
			// }
// 
			// ui.headLabel.text = " " + geo.compHeading + "°";
// 
			// //Titanium.API.info('geo - heading updated: ' + new Date(timestamp));
		// };
// 		
		// //
		// //  GET CURRENT HEADING - THIS FIRES ONCE
		// //
		// Ti.Geolocation.getCurrentHeading(headingCallback);
// 		
// 		
		// //
		// // EVENT LISTENER FOR COMPASS EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON HEADING FILTER)
		// //
		// Titanium.Geolocation.addEventListener('heading', headingCallback);
		// headingAdded = true;
	// } else {
		// Titanium.API.info("No Compass on device");
	// }

// putting this stuff in a temp function so it won't break the app
function temp () {

	//
	//  SET ACCURACY - THE FOLLOWING VALUES ARE SUPPORTED
	//
	// Titanium.Geolocation.ACCURACY_BEST
	// Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS
	// Titanium.Geolocation.ACCURACY_HUNDRED_METERS
	// Titanium.Geolocation.ACCURACY_KILOMETER
	// Titanium.Geolocation.ACCURACY_THREE_KILOMETERS
	//
	// Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

	//
	//  SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVES
	//  THIS VALUE IS IN METERS
	//
	// Titanium.Geolocation.distanceFilter = 3;

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

			geo.longitude = e.coords.longitude;
			geo.latitude = e.coords.latitude;
			geo.altitude = Math.round(e.coords.altitude);
			geo.gpsHeading = Math.round(((e.coords.heading + 360) % 360));
			geo.accuracy = e.coords.accuracy;
			geo.speed = Math.round((e.coords.speed) * 10) / 10;
			geo.timestamp = e.coords.timestamp;
			geo.altitudeAccuracy = e.coords.altitudeAccuracy;	
			//Ti.API.info('speed ' + speed);

			// set the info in the location screen
			ui.currentLatLabel.text = ("Latitude: " + geo.latitude);
			ui.currentLonLabel.text = ("Longitude: " + geo.longitude);
			ui.currentAltLabel.text = ("Altitude: " + geo.altitude);
			ui.currentSpeedLabel.text = ("Speed: " + geo.speed);
			ui.currentGPSHeadLabel.text = ("Moving: " + geo.gpsHeading);

			//Titanium.API.info('geo - current location: ' + new Date(geo.timestamp) + ' long ' + geo.longitude + ' lat ' + geo.latitude + ' accuracy ' + geo.accuracy);
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
			geo.longitude = e.coords.longitude;
			geo.latitude = e.coords.latitude;
			geo.altitude = Math.round(e.coords.altitude);
			geo.gpsHeading = Math.round(((e.coords.heading + 360) % 360));
			geo.accuracy = e.coords.accuracy;
			geo.speed = Math.round((e.coords.speed) * 10) / 10;
			geo.timestamp = e.coords.timestamp;
			geo.altitudeAccuracy = e.coords.altitudeAccuracy;	
		}
		

		// set the info in the location screen
		ui.currentLatLabel.text = ("Latitude: " + geo.latitude);
		ui.currentLonLabel.text = ("Longitude: " + geo.longitude);
		ui.currentAltLabel.text = ("Altitude: " + geo.altitude);
		ui.currentSpeedLabel.text = ("Speed: " + geo.speed);
		ui.currentGPSHeadLabel.text = ("Moving: " + geo.gpsHeading);

		//Titanium.API.info('geo - location updated: ' + new Date(geo.timestamp) + ' long ' + geo.longitude + ' lat ' + geo.latitude + ' accuracy ' + geo.accuracy);
	};
	Titanium.Geolocation.addEventListener('location', locationCallback);
	locationAdded = true;

// }

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
	var R = 6371; // km
	
	// TODO I will always be looking for distance from where you are, I should remove the additional args being passed in
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

