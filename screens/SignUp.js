import { View, Text, TouchableOpacity, Image, TextInput  , SafeAreaView} from 'react-native'
import React , {useState} from 'react'
import { themeColors } from '../theme'
// import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Toast from "react-native-toast-message";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// subscribe for more videos like this :)
export default function SignUpScreen() {
    const navigation = useNavigation();
    const [email , setemail] = useState("")
    const [password , setpassword] = useState("")
    const [userName , setuserName] = useState("");

    const registerUser = ()=>{
        try {
            if(userName == "" || email == "" || password == ""){
                Toast.show({
                    type:"success",
                    text1:"Please enter all details"
                })
                return;
            }
            else{
                axios.post("https://expense-tracker-room.onrender.com/userRegister" ,{
                    userName,
                    email,
                    password
                }).then((res)=>{
                    const {status  , msg} = res.data;
                    if(status == "Success"){
                        Toast.show({
                            type:"success",
                            text1:msg
                        })
                    }
                    else if(status == "failed"){
                        Toast.show({
                            type:"error",
                            text1:msg
                        })
                    }
                })
            }

            
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <>
    <View className="flex-1 bg-white" style={{backgroundColor: themeColors.bg}}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
            <TouchableOpacity 
                onPress={()=> navigation.goBack()}
                className="bg-yellow-400 p-2 mt-6 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
            <MaterialCommunityIcons name="arrow-left" color={"black"} size={26} />
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mb-5">
            <Image source={require('../assets/images/signup.png')} 
                style={{width: 165, height: 110}} />
        </View>
      </SafeAreaView>
    <Toast />

      <View className="flex-1 bg-white px-8 pt-8"
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}
      >
        <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">Full Name</Text>
            <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                value={userName}
                onChangeText={(text) => setuserName(text)}
                placeholder='Enter Name'
            />
            <Text className="text-gray-700 ml-4">Email Address</Text>
            <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                value={email}
                onChangeText={(text) => setemail(text)}
                placeholder='Enter Email'
            />
            <Text className="text-gray-700 ml-4">Password</Text>
            <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
                secureTextEntry
                value={password}
                onChangeText={(text) => setpassword(text)}
                placeholder='Enter Password'
            />
            <TouchableOpacity
                className="py-3 bg-yellow-400 rounded-xl"
                onPress={registerUser}
            >
                <Text className="font-xl font-bold text-center text-gray-700">
                    Sign Up
                </Text>
            </TouchableOpacity>
        </View>
        <Text className="text-xl text-gray-700 font-bold text-center py-5">
            Or
        </Text>
        <View className="flex-row justify-center space-x-12">
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                <Image source={require('../assets/icons/google.png')} 
                    className="w-10 h-10" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                <Image source={require('../assets/icons/apple.png')} 
                    className="w-10 h-10" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                <Image source={require('../assets/icons/facebook.png')} 
                    className="w-10 h-10" />
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-7">
            <Text className="text-gray-500 font-semibold">Already have an account?</Text>
            <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                <Text className="font-semibold text-yellow-500"> Login</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
    </>
  )
}
