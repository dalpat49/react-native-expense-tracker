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

