import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from './HomeScreen';
import Login from './Login';
import RoomExpense from './RoomExpense';
import Personal from './Personal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'RoomExpense') {
            iconName = focused
                ? 'receipt'
                : 'receipt-outline';
            } else if (route.name === 'Login') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }
            else if (route.name === 'Account') {
               iconName = focused ? 'person' : 'person-outline';
            }
            else if (route.name === 'Personal') {
               iconName = focused ? 'reader' : 'reader-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        })}
    >
        <Tab.Screen name="RoomExpense" component={RoomExpense} options={{headerShown: false}} />
        <Tab.Screen name="Login" component={Login} options={{headerShown: false}}  />
        <Tab.Screen name="Personal" component={Personal} options={{headerShown: false}}  />
        <Tab.Screen name="Account" component={Login} options={{headerShown: false}} />
      </Tab.Navigator>
  );
};

export default BottomNavigation;
