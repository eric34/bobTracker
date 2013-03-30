var anim = {};
module.exports = anim;

//track where I think the main needle should be
var needleNow = 0;
var needleGoto = 0;
var heading = 0;
var needleSlew = 0;

//track where I think the way point needle should be
var wayneedleNow = 0;
var wayneedleGoto = 0;
var wayneedleSlew = 0;

// Create a 2D matrix for the main needle
var t = Ti.UI.create2DMatrix();

// Create a 2D matrix for the waypoint needle
var t2 = Ti.UI.create2DMatrix();

// Create an animation using the 2D matrix for the main needle
var a = Titanium.UI.createAnimation({
	transform : t
});

// Create an animation using the 2D matrix for the waypoint needle
var a2 = Titanium.UI.createAnimation({
	transform : t
});

//This should be a function to animate the main needle
// set the heading
heading = Math.round(e.heading.magneticHeading);

//////////////////////////////////////
// handle the main needle        ////
////////////////////////////////////

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

ui.needleImage.animate(a);

ui.headLabel.text = " " + heading + "°";

//////////////////////////////////////
// handle the waypoint needle    ////
////////////////////////////////////

// check if there is an active waypoint
if (activeWaypoint) {
	var bearing = activeBearing;
	// set a bearing for testing

	// if the heading is greater than the bearing, we must set where the needle needs to go differently
	if (heading > bearing) {

		wayneedleGoto = (360 - heading) + bearing;

	} else {
		wayneedleGoto = (bearing - heading);
	}

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

	ui.wayneedleImage.animate(a2);
}


