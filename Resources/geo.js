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
//geo,headingPref='mag';
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
Ti.Geolocation.showCalibration = true; //  TURN OFF ANNOYING COMPASS INTERFERENCE MESSAGE
Titanium.Geolocation.headingFilter = 1; // SET THE HEADING FILTER (THIS IS IN DEGREES OF ANGLE CHANGE) EVENT WON'T FIRE UNLESS ANGLE CHANGE EXCEEDS THIS VALUE
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST; // Set the GPS accuracy I want
Titanium.Geolocation.distanceFilter = 1; //SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVes IN METERS


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
		if(geo.activeWaypoint) {
			geo.activeDist = geo.distanceCheck(geo.latitude, geo.longitude, geo.activeLat, geo.activeLon);
			ui.currentWaypointDist.text = geo.activeDist+" Miles"; // set the location label for distance
			geo.activeBearing = geo.bearingCheck(geo.latitude, geo.longitude, geo.activeLat, geo.activeLon);
			ui.currentWaypointBear.text = geo.activeBearing+"°"; // set the location label for bearing
			ui.currentWaypointName.text = geo.activeName;
			ui.waypointLabel.text = geo.activeName + "  Latitude: " + geo.activeLat + "  Longitude: " + geo.activeLon + " Bearing: " + geo.activeBearing + " Distance: " + geo.activeDist;
		}

		//Titanium.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
	};
	Titanium.Geolocation.addEventListener('location', locationCallback);
	locationAdded = true;

	// }

};


////////   ------------>>>   Here I will try to make the math into a function

// first the prototypes.
Number.prototype.toRad = function() {
	return this * Math.PI / 180;
};

Number.prototype.toDeg = function() {
	return this * 180 / Math.PI;
};

///   now the distance formula
geo.distanceCheck = function(lat1, lon1, lat2, lon2) {
	var R = 6371; // km
	
	// TODO I will always be looking for distance from where you are, I should remove the additional args being passed in
	var dLat = (lat2 - lat1).toRad();
	Ti.API.info("in the distance formula");
	var dLon = (lon2 - lon1).toRad();
	var lat1 = lat1.toRad();
	var lat2 = lat2.toRad();

	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	var feet = d*3280.84;
	//var miles = Math.round((d / 1.6) * 100) / 100;
	var miles = d/1.6;
	miles = miles.toFixed(2);
	Ti.API.info("Feet is: " + feet);
	Ti.API.info("Miles is: " + miles);

	return miles;

};

// and the bearing formula
geo.bearingCheck = function(lat1, lon1, lat2, lon2) {
    var φ1 = lat1*Math.PI/180, φ2 = lat2*Math.PI/180;
    var Δλ = (lon2-lon1)*Math.PI/180;
	Ti.API.info("In the bearing function");
	Ti.API.info("Lat and long 1: "+lat1+" "+lon1+"   And lat/long 2: "+lat2+"   "+lon2);
	
    // see http://mathforum.org/library/drmath/view/55417.html
    var y = Math.sin(Δλ) * Math.cos(φ2);
    var x = Math.cos(φ1)*Math.sin(φ2) -
            Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
    var θ = Math.atan2(y, x);

    return Math.round((θ*180/Math.PI+360) % 360);
};



