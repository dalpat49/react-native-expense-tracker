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
import Login from "../screens/Login";
import RoomExpense from "../screens/RoomExpense";
import NewBottom from "../screens/NewBottom";
import BottomNavigation from "../screens/BottomNavigation";
import SignUp from "../screens/SignUp";
import WelcomeScreen from "../screens/WelcomeScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import axios from 'axios';
import * as BackgroundFetch from 'expo-background-fetch';

const Stack = createNativeStackNavigator();


export const LoginStackNavigator =()=>{
  return(
    <>
      <Stack.Navigator>

     <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{headerShown:false}} />
      <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false , animationTypeForReplace: 'push', animation:'slide_from_right'}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown:false , animationTypeForReplace: 'push', animation:'slide_from_right'}} />
      <Stack.Screen name="HomeScreen" component={MainScreenNavigation} options={{headerShown:false , animationTypeForReplace: 'push', animation:'slide_from_right'}} />
      </Stack.Navigator>

    </>
  )
}

export const MainScreenNavigation =()=>{
  return(
    <>
      <Stack.Navigator>
      <Stack.Screen name="NewBottom" component={NewBottom} options={{headerShown:false}} />
      <Stack.Screen name="mainLogin" component={LoginStackNavigator} options={{headerShown:false}} />

      </Stack.Navigator>

    </>
  )
}

