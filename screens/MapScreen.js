import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text ,ActivityIndicator} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Appbar from "./Appbar"
import axios from 'axios';
import * as BackgroundFetch from 'expo-background-fetch';
import { startBackgroundLocationTracking, stopBackgroundLocationTracking, BACKGROUND_LOCATION_TASK_NAME } from '../BackgroundTask';


const MapScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [allDeviceLocations, setAllDeviceLocations] = useState([]);

  useEffect(() => {
    // Request permissions for location access
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Get the current device location
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Simulate multiple devices with dummy locations
    //   const dummyLocations = [
    //     { id: 'device1', latitude: 26.912434, longitude: 75.787270 },
    //     { id: 'device2', latitude: 37.7749, longitude: -122.4194 },
    //     { id: 'device3', latitude: 37.7914, longitude: -122.4025 },
    //     // Add more dummy locations as needed
    //   ];
    //   setAllDeviceLocations(dummyLocations);
    })();
  }, []);
  
  const fetchAllLocations = async () => {
    try {
      const response = await axios.get(`https://expense-tracker-room.onrender.com/getLocations`);
      setAllDeviceLocations(response.data.data);
      console.log(allDeviceLocations)
    } catch (error) {
      console.error('Error fetching device locations:', error);
    }
  };

  useEffect(() => {
    // Fetch the location data of all devices from the backend
    fetchAllLocations();
  }, []);

  setInterval(() => {
    fetchAllLocations()
  }, 900000);


  useEffect(() => {
    // Set up the background fetch task
    const backgroundFetchTask = async (taskId) => {
      if (taskId === BACKGROUND_LOCATION_TASK_NAME) {
        console.log('Background fetch task triggered');
        // Start background location tracking
        startBackgroundLocationTracking();
        // Finish the background fetch task
        // BackgroundFetch.unregisterTaskAsync(taskId);
      }
    };

    BackgroundFetch.registerTaskAsync(BACKGROUND_LOCATION_TASK_NAME)
      .then(() => {
        console.log('Background fetch task registered');
      })
      .catch((error) => {
        console.error('Error registering background fetch task:', error);
      });
      backgroundFetchTask()

    // return () => {
    //   // Stop background location tracking when the app is closed
    //   stopBackgroundLocationTracking();
    // };
  }, []);

  return (
    <>
    <Appbar title='Map' />
    <View style={styles.container}>
      {currentLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {allDeviceLocations.map((device , key) => (
            <Marker
              key={key}
              coordinate={{
                latitude: device.device_lat,
                longitude: device.device_long,
              }}
              title={device.device_id}
              description={`Device ${device.device_id} Location`}
            //   image={require('../assets/icons/google.png')}
            //   image={require('../assets/icons/google.png')}
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
