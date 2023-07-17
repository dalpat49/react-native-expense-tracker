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
// import ExpenseItem from "./screens/ExpenseItem";
import NetInfo from "@react-native-community/netinfo";
import ConnectToInternetModal from "./screens/ConnectToInternetModal";
import axios from "axios";
import Toast from "react-native-toast-message";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, Icon } from 'react-native-elements';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./screens/Login";
import RoomExpense from "./screens/RoomExpense";
import NewBottom from "./screens/NewBottom";
import BottomNavigation from "./screens/BottomNavigation";
import SignUp from "./screens/SignUp";
import WelcomeScreen from "./screens/WelcomeScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {

  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('isLoggedIn');
      if (value !== null && value === 'true') {
        setLoggedIn(true);
      }
    } catch (error) {
      console.log('Error checking login status:', error);
      
    }
  };



  return (
    <>
     <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
      {isLoggedIn ? 
        (
          <Stack.Screen name="NewBottom" component={NewBottom} options={{headerShown:false}} />
        )
        :
        (
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{headerShown:false}} />
        )
      }

      <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false , animationTypeForReplace: 'push', animation:'slide_from_right'}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown:false , animationTypeForReplace: 'push', animation:'slide_from_right'}} />

      </Stack.Navigator>
    </NavigationContainer>
    {/* <Login /> */}
    </>
  );
};

const styles = StyleSheet.create({
 
});

export default App;

