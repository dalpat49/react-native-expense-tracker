import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Device from 'expo-device';


const BACKGROUND_LOCATION_TASK_NAME = 'background-location-task';

// Define the background location task
TaskManager.defineTask(BACKGROUND_LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Error in background location task:', error);
    return;
  }

  if (data) {
    const { locations } = data;

    // Send the locations to the backend
    console.log('Background locations:', locations);
    
    // Implement your logic to send the locations to the backend here
  }
});

const startBackgroundLocationTracking = async () => {
  try {
    // Check if the background location permission is granted
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Background location permission denied');
      return;
    }

    // Start tracking location updates in the background
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 60000, // Interval for location updates (in milliseconds) - 1 minute in this example
      distanceInterval: 1, // Minimum distance (in meters) the device needs to move to trigger an update
      showsBackgroundLocationIndicator: true,
    });
    Location.addLocationListener(handleLocationUpdate);
    
    console.log('Background location tracking started');
  } catch (error) {
    console.error('Error starting background location tracking:', error);
  }
};

const handleLocationUpdate = async ({ coords }) => {
  const { latitude, longitude } = coords;

  try {
    // Send the location data to the backend
    let device_id = Device.deviceName;
    let device_lat = latitude;
    let device_long = longitude;
    let userName = 'dalpat';

      await axios
        .post("https://expense-tracker-room.onrender.com/postLocations", {
          device_id,
          device_lat,
          device_long,
          userName
        })
        .then((response) => {
          
          // Clear input fields
          let { status, msg } = response.data;

          if (status == "Success") {
            console.log(msg)
            console.log(device_lat)
            console.log(device_long)
            console.log(isLoggedIn)
          }
          else if(status == "Failed") {
            console.log(msg)
            console.log(device_lat)
            console.log(device_long)
          }        
        })
        .catch((error) => {
          console.log(error);
        });
     
    console.log('Location sent to the backend:', latitude, longitude);
  } catch (error) {
    console.error('Error sending location to the backend:', error);
  }
};

const stopBackgroundLocationTracking = async () => {
  try {
    // Stop tracking location updates in the background
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK_NAME);
    console.log('Background location tracking stopped');
  } catch (error) {
    console.error('Error stopping background location tracking:', error);
  }
};

export { BACKGROUND_LOCATION_TASK_NAME, startBackgroundLocationTracking, stopBackgroundLocationTracking };
