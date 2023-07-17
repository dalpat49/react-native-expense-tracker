import * as React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RoomExpense from './RoomExpense';
import AccountSection from './AccountSection';
import Personal from './Personal';



const Tab = createMaterialBottomTabNavigator();

function NewBottom() {
  return (
    <Tab.Navigator
        initialRouteName="Home"
        activeColor="#e91e63"
    >
      <Tab.Screen 
        name="Home"
        component={RoomExpense}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color , focused }) => (
            <MaterialCommunityIcons name="home" color={color} size={focused ? 30 :26} />
          ),
        }} />

        <Tab.Screen 
            name="Personal"
            component={Personal}
            options={{
            tabBarLabel: 'Personal',
            tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="notebook" color={color} size={26} />
            ),
            }} 
        />
        <Tab.Screen 
          name="Account"
          component={AccountSection}
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-circle" color={color} size={26} />
            ),
          }} 
        />
     
    </Tab.Navigator>
  );
}
export default NewBottom;
