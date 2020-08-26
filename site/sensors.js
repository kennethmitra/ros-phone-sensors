//Setup event listeners
document.getElementById('enable_device_orientation_btn').addEventListener('click', function(){enable_device_orientation();});
document.getElementById('enable_device_motion_btn').addEventListener('click', function(){enable_device_motion();});
document.getElementById('enable_geolocation_btn').addEventListener('click', function(){enable_geolocation();});
document.getElementById('enable_camera_0_btn').addEventListener('click', function(){enable_camera_0();});
document.getElementById('enable_camera_1_btn').addEventListener('click', function(){enable_camera_1();});


//Orientation/Motion
let gn = new GyroNorm();
gn.is_started = false;
let gn_args = {
	frequency:50,					// ( How often the object sends the values - milliseconds )
	gravityNormalized:true,			// ( If the gravity related values to be normalized )
	orientationBase:GyroNorm.GAME,		// ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
	decimalCount:2,					// ( How many digits after the decimal point will there be in the return values )
	logger:null,					// ( Function to be called to log messages from gyronorm.js )
	screenAdjusted:false			// ( If set to true it will return screen adjusted values. )
};

function enable_device_orientation() {
    console.log("enable_device_orientation");
    if ( typeof( DeviceOrientationEvent ) !== "undefined" && typeof( DeviceOrientationEvent.requestPermission ) === "function" ) {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
            if (response == 'granted') {
                console.log("device orientation permission granted");
                if(!gn.is_started){ //Start GyroNorm if not started
                    gn.init(gn_args).then(function(){
                        gn.start(
                            function(data){
                                gn.is_started = true;
                                process_gyronorm_update(data);
                            }
                        );
                    }).catch(function(e){
                        console.log("device orientation/motion error");
                    });
                }

            }
            })
            .catch(console.error)
    } else {
        document.getElementById('device_orientation_out').innerHTML = "NOT AVAILABLE"
    }
} 

function enable_device_motion() {
    console.log("enable_device_motion");
    if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
        DeviceMotionEvent.requestPermission()
            .then(response => {
            if (response == 'granted') {
                console.log("device motion permission granted");
                if(!gn.is_started){ //Start GyroNorm if not started
                    gn.init(gn_args).then(function(){
                        gn.start(
                            function(data){
                                gn.is_started = true;
                                process_gyronorm_update(data);
                            }
                        );
                    }).catch(function(e){
                        console.log("device orientation/motion error");
                    });
                }
            }
            })
            .catch(console.error)
    } else {
        document.getElementById('device_motion_out').innerHTML = "NOT AVAILABLE";
    }
}

function process_gyronorm_update(data) {
    document.getElementById('device_orientation_out').innerHTML = `alpha: ${data.do.alpha}, beta: ${data.do.beta}, gamma: ${data.do.gamma}, absolute: ${data.do.absolute}`;
    document.getElementById('device_motion_out').innerHTML = `a_x: ${data.dm.x}, a_y: ${data.dm.y}, a_z: ${data.dm.z} \n ag_x: ${data.dm.gx}, ag_y: ${data.dm.gy}, ag_z: ${data.dm.gz} \n alpha: ${data.dm.alpha}, beta: ${data.dm.beta}, gamma: ${data.dm.gamma}`;
}

//Geolocation
let geo_watchID = -1;

function enable_geolocation() {
    console.log("enable_geolocation");
    if(navigator.geolocation) {
        //Request position to trigger permissions request
        navigator.geolocation.getCurrentPosition(update_geolocation, update_geolocation_error);

        //Start geolocation callback
        const options = {
            enableHighAccuracy: true, 
            maximumAge: 0, 
            timeout: 30000
        };
        geo_watchID = navigator.geolocation.watchPosition(update_geolocation, update_geolocation_error, options);
    } else {
        document.getElementById('geolocation_out').innerHTML = "NOT AVAILABLE";
    }
}

function update_geolocation(position) {
    document.getElementById('geolocation_out').innerHTML = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude} @ ${position.timestamp}`
}

function update_geolocation_error(error) {
    let textbox = document.getElementById('geolocation_out');
    switch(error.code) {
        case error.PERMISSION_DENIED:
            textbox.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            textbox.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            textbox.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            textbox.innerHTML = "An unknown error occurred."
            break;
    }
}

function enable_camera_0() {
    console.log("enable_camera_0");
}

function enable_camera_1() {
    console.log("enable_camera_1");
}

