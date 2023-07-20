import React, { useState, useEffect , useRef} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Modal,
  Platform,
  RefreshControl
} from "react-native";
import * as Device from 'expo-device';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./screens/Login";
import RoomExpense from "./screens/RoomExpense";
import NewBottom from "./screens/NewBottom";
import BottomNavigation from "./screens/BottomNavigation";
import SignUp from "./screens/SignUp";
import WelcomeScreen from "./screens/WelcomeScreen";
import {LoginStackNavigator , MainScreenNavigation} from './navigation/AllNavigation'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import axios from 'axios';
import * as BackgroundFetch from 'expo-background-fetch';
import { startBackgroundLocationTracking, stopBackgroundLocationTracking, BACKGROUND_LOCATION_TASK_NAME } from './BackgroundTask';



const Stack = createNativeStackNavigator();

const App = () => {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('keepLogin');
      setLoggedIn(value);
      console.log(isLoggedIn);
    } catch (error) {
      console.error('Error reading login status:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  
  
useEffect(() => {
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
  })();
}, [])

  //register background location
  useEffect(() => {
    // Set up the background fetch task
    const backgroundFetchTask = async (taskId) => {
      if (taskId === BACKGROUND_LOCATION_TASK_NAME) {
        console.log('Background fetch task triggered');
        // Start background location tracking
        startBackgroundLocationTracking();
        // Finish the background fetch task
        BackgroundFetch.unregisterTaskAsync(taskId);
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

  setTimeout(() => {
    addLocations();
  }, 2000);

  setInterval(() => {
    addLocations();
  }, 900000);


  const addLocations = async () => {
    let device_id = Device.deviceName;
    let device_lat = currentLocation.latitude;
    let device_long = currentLocation.longitude;
    let userName = 'dalpat';

    try {
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

          }
          else if(status == "Failed") {
            
          }
        
        })
        .catch((error) => {
          console.log(error);
        });
      // Fetch updated expenses
    } catch (error) {
      console.error(error);
    }
  };

  const updateLocation  = ()=>{

  }


  return (
    <>
     <NavigationContainer>
      {isLoggedIn 
       ?  <MainScreenNavigation /> :
        <LoginStackNavigator />
        }
    </NavigationContainer>
    {/* <Login /> */}
    </>
  );
};

const styles = StyleSheet.create({
 
});

export default App;

