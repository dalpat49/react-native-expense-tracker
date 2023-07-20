import { View, Text, Image, TouchableOpacity , SafeAreaView  , BackHandler } from 'react-native'
import React, { useState, useEffect , useRef} from "react";
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Appbar from "./Appbar";



export default function AccountSection() {
    const navigation = useNavigation();
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogout = async()=>{
    await AsyncStorage.setItem("keepLogin" , JSON.stringify(false));
    await AsyncStorage.setItem('userName', '');
    await AsyncStorage.setItem('userEmail', '');
    navigation.navigate("mainLogin")

  }
    
  return (
    <>
    <Appbar title="Account"> </Appbar>
    <SafeAreaView className="flex-1" style={{backgroundColor: themeColors.bg}}>
        <View className="flex-1 flex justify-around my-4">
            <Text 
                className="text-white font-bold text-4xl text-center">
                {/* Let's Get Started! */}
            </Text>
            <View className="flex-row justify-center">
                <Image source={require("../assets/images/welcome.png")}
                    style={{width: 350, height: 350}} />
            </View>
            <View className="space-y-4">
                <TouchableOpacity
                    onPress={handleLogout}
                    className="py-3 bg-yellow-400 mx-7 rounded-xl">
                        <Text 
                            className="text-xl font-bold text-center text-gray-700"
                        >
                            Logout
                        </Text>
                </TouchableOpacity>
                
            </View>
        </View>
    </SafeAreaView>
    </>
  )
}