var gd = {};
module.exports = gd;

gd.start = function(){
if (Titanium.Geolocation.hasCompass)
    {
        Titanium.Geolocation.showCalibration = false;
        Titanium.Geolocation.headingFilter = 1;
 
        Ti.Geolocation.getCurrentHeading(function(e)
        {
            if (e.error)
            {
                currentHeading.text = 'error: ' + e.error;
                return;
            }
            var x = e.heading.x;
            var y = e.heading.y;
            var z = e.heading.z;
            var magneticHeading = e.heading.magneticHeading;
            var accuracy = e.heading.accuracy;
            var trueHeading = e.heading.trueHeading;
            var timestamp = e.heading.timestamp;
 
            Titanium.API.info('geo - current heading: ' + trueHeading);
        });
 
        Titanium.Geolocation.addEventListener('heading',function(e)
        {
            if (e.error)
            {
                Titanium.API.info("error: " + e.error);
                return;
            }
 
            var x = e.heading.x;
            var y = e.heading.y;
            var z = e.heading.z;
            var magneticHeading = e.heading.magneticHeading;
            var accuracy = e.heading.accuracy;
            var trueHeading = e.heading.trueHeading;
            var timestamp = e.heading.timestamp;
 
            Titanium.API.info('geo - heading updated: ' + trueHeading);
        });
    }
    else
    {
        Titanium.API.info("No Compass on device");
    }
}