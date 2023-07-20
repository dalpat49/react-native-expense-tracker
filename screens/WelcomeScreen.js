import { View, Text, Image, TouchableOpacity , SafeAreaView  , BackHandler } from 'react-native'
import React, { useState, useEffect , useRef} from "react";
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function WelcomeScreen() {
    const navigation = useNavigation();
  const [isLoggedIn, setLoggedIn] = useState(false);


      useEffect(() => {
        const disableGoBack = () => {
          return true; // Return true to indicate that you want to disable the default "go back" behavior
        };
    
        // Add the event listener for the hardware back button press
        BackHandler.addEventListener('hardwareBackPress', disableGoBack);
    
        // Return a cleanup function to remove the event listener when the component is unmounted
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', disableGoBack);
        };
      }, []);
    
  return (
    <SafeAreaView className="flex-1" style={{backgroundColor: themeColors.bg}}>
        <View className="flex-1 flex justify-around my-4">
            <Text 
                className="text-white font-bold text-4xl text-center">
                Let's Get Started!
            </Text>
            <View className="flex-row justify-center">
                <Image source={require("../assets/images/welcome.png")}
                    style={{width: 350, height: 350}} />
            </View>
            <View className="space-y-4">
                <TouchableOpacity
                    onPress={()=> navigation.navigate('SignUp')}
                    className="py-3 bg-yellow-400 mx-7 rounded-xl">
                        <Text 
                            className="text-xl font-bold text-center text-gray-700"
                        >
                            Sign Up
                        </Text>
                </TouchableOpacity>
                <View className="flex-row justify-center">
                    <Text className="text-white font-semibold">Already have an account?</Text>
                    <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                        <Text className="font-semibold text-yellow-400"> Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </SafeAreaView>
  )
}