var anim = {};
module.exports = anim;

//track where I think the main needle should be
// TODO consider moving this inside the function
var needleNow = 0;
var needleGoto = 0;
var heading = 0;
var needleSlew = 0;

//track where I think the way point needle should be
// TODO consider moving this inside the function
var wayneedleNow = 0;
var wayneedleGoto = 0;
var wayneedleSlew = 0;

// Create a 2D matrix for the main needle and waypoint needle
var t = Ti.UI.create2DMatrix(); // main
var t2 = Ti.UI.create2DMatrix(); // waypoint

// Create an animation using the 2D matrix for the main needle and the waypoint needle
var a = Titanium.UI.createAnimation({
	transform : t
}); // main
var a2 = Titanium.UI.createAnimation({
	transform : t
}); // waypoint


// This function animates the main Needle
anim.mainNeedleAnimate = function() {
	
	
	// set the heading - which I do not need
	// heading = Math.round(e.heading.magneticHeading);
// TODO make sure I round the heading before running this function

	// needleGoto = Math.abs((heading - 360));
	needleGoto = Math.abs((geo.compHeading - 360));

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

	ui.headLabel.text = " " + geo.compHeading + "°";
};


anim.wayNeedleAnimate = function() {

	// check if there is an active waypoint
	// I could simply do this check outside the function and not call.
	// TODO remove this check if I implement it outside the function
	if (geo.activeWaypoint) {
		
		// I used to set this variable, but why bother?
		// var bearing = geo.activeBearing;
	

		// if the heading is greater than the bearing, we must set where the needle needs to go differently
		if (geo.compHeading > geo.activeBearing) {

			wayneedleGoto = (360 - geo.compHeading) + geo.activeBearing;

		} else {
			wayneedleGoto = (geo.activeBearing - geo.compHeading);
		}

		// figure out how to animate the way needle
		// TODO Perhaps change this to case statement
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

};
