// declare variables for position
var longitude = 0;
var latitude = 0;
var altitude = 0;
var heading = 0;
var accuracy = 0;
var speed = 0;
var timestamp = 0;
var altitudeAccuracy = 0;
var magneticHeading = 0;
var trueHeading = 0;

Ti.Geolocation.preferredProvider = "gps";

if (isIPhone3_2_Plus()) {
	//NOTE: starting in 3.2+, you'll need to set the applications
	//purpose property for using Location services on iPhone
	Ti.Geolocation.purpose = "GPS demo";
}

function translateErrorCode(code) {
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
}

// state vars used by resume/pause
var headingAdded = false;
var locationAdded = false;

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
		if (win.openedflag == 0) {
			Ti.API.info('firing open event');
			win.fireEvent('open');
		}
		if (win.focusedflag == 0) {
			Ti.API.info('firing focus event');
			win.fireEvent('focus');
		}
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
				currentHeading.text = 'error: ' + e.error;
				Ti.API.info("Code translation: " + translateErrorCode(e.code));
				return;
			}

			magneticHeading = e.heading.magneticHeading;
			accuracy = e.heading.accuracy;
			trueHeading = e.heading.trueHeading;
			timestamp = e.heading.timestamp;

			Titanium.API.info('geo - current heading: ' + new Date(timestamp));
		});

		//
		// EVENT LISTENER FOR COMPASS EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON HEADING FILTER)
		//
		var headingCallback = function(e) {
			if (e.error) {
				updatedHeading.text = 'error: ' + e.error;
				Ti.API.info("Code translation: " + translateErrorCode(e.code));
				return;
			}

			magneticHeading = e.heading.magneticHeading;
			accuracy = e.heading.accuracy;
			trueHeading = e.heading.trueHeading;
			timestamp = e.heading.timestamp;

			Titanium.API.info('geo - heading updated: ' + new Date(timestamp));
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
	win.addEventListener('open', function() {
		win.openedflag = 1;
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				currentLocation.text = 'error: ' + JSON.stringify(e.error);
				Ti.API.info("Code translation: " + translateErrorCode(e.code));
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

			Titanium.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
		});
	});

	//
	// EVENT LISTENER FOR GEO EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON DISTANCE FILTER)
	//
	var locationCallback = function(e) {
		//Mobileweb seems to be not firing window event for some odd reason.
		//Forcing a window open and focus event.
		if (win.openedflag == 0) {
			Ti.API.info('firing open event');
			win.fireEvent('open');
		}
		if (win.focusedflag == 0) {
			Ti.API.info('firing focus event');
			win.fireEvent('focus');
		}
		if (!e.success || e.error) {
			updatedLocation.text = 'error:' + JSON.stringify(e.error);
			updatedLatitude.text = '';
			updatedLocationAccuracy.text = '';
			updatedLocationTime.text = '';
			Ti.API.info("Code translation: " + translateErrorCode(e.code));
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

		//Titanium.Geolocation.distanceFilter = 100; //changed after first location event

		Titanium.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
	};
	Titanium.Geolocation.addEventListener('location', locationCallback);
	locationAdded = true;

}

win.addEventListener('focus', function() {
	win.focusedflag = 1;
	Ti.API.info("focus event received");
	if (!headingAdded && headingCallback) {
		Ti.API.info("adding heading callback on resume");
		Titanium.Geolocation.addEventListener('heading', headingCallback);
		headingAdded = true;
	}
	if (!locationAdded && locationCallback) {
		Ti.API.info("adding location callback on resume");
		Titanium.Geolocation.addEventListener('location', locationCallback);
		locationAdded = true;
	}

});

win.addEventListener('blur', function() {
	Ti.API.info("pause event received");
	if (headingAdded) {
		Ti.API.info("removing heading callback on pause");
		Titanium.Geolocation.removeEventListener('heading', headingCallback);
		headingAdded = false;
	}
	if (locationAdded) {
		Ti.API.info("removing location callback on pause");
		Titanium.Geolocation.removeEventListener('location', locationCallback);
		locationAdded = false;
	}
});

