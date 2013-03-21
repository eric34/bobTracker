Welcome to bobTracker project.

This will be a custom iPhone 4 - iPhone 5 app that will provide simple geolocation and compass displays plus a list of built in coordinates that can be selected and navigated to. The waypoints are specific points along the Kanetok river in Alaska.  
These waypoints were estimated from a series of google map .jpg images showing the points.

The app will have the following windows in a tab group:

- Compass page
This page will have:
a heading display in degrees (magnetic North)
a compass dial with animated needle pointing magnetic north.
an additional needle with heading to waypoint if one is active
an info section which lists active waypoint information and gps speed and direction of travel info (direction of travel is different than heading. Heading is the direction the phone is pointing)
if there is no active waypoint, the info section will only list speed and direction of travel info. (Why you would have an inactive waypoint other than at first app launch I can't tell you)
What would be cool is to also plot the direction of travel on the compass, but that might be too busy.
I'd like to allow switching between magnetic and true north, but this may not be possible in the time I have to develop.

- Waypoints page
A tableview of waypoints, iOS grouped style. THe first section will be the hard-coded list of waypoints.
If I have time, I will add the ability to mark a waypoint and it will be saved in a new tableview section called "User waypoints" or something. This will be saved as a property, so I'll need to set and check a property then load he table on launch if so

- Location page
This will be a three section window showing:
1) The user's location and speed data
2) The user's location relative to the selected waypoint
3) The user's location relative to the river pull-out

The idea to limit the gps and compass from devouring the battery is to either:
1) Remove the callback listeners on page blur. - Not sure if this will work on app background
2) Simply use the compass filter and the gps filter to look for large increments before firing. - not sure this will work on app backgrounding. Also unsure if you can shut these off with a value high enough.




