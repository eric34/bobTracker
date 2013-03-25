
// This file will manage waypoint data if I can get to the "add waypoint" feature
var pd = {};
module.exports = pd;

// this will add the list of default waypoints to the properties when the app is first launched
// maybe I should just keep the default waypoints hardcoded, and make this do that
pd.warmUp = function() {
	
}

// This function will check the data to see if there are any user-created waypoints. If so, add them to the waypoint tableview, but in another section (group)
pd.checkStatus = function() {
	// if not inited, call warm up
}


// This will add a user waypoint
pd.add =function (waypoint) {
	
}

// This will remove a user waypoint
pd.remove = function (waypoint) {
	
}

