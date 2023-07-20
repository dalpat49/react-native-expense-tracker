import { View, Text, TouchableOpacity, Image, TextInput ,SafeAreaView } from 'react-native'
import React  , {useState} from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
import { themeColors } from '../theme'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from "react-native-toast-message";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function LoginScreen() {
  const navigation = useNavigation();

  const [email , setEmail] = useState("");
  const [password , setpassword] = useState("");

  const handleLogin = async()=>{
    try{
      if(email == '' || password == ''){
        Toast.show({
          type:"error",
          text1:"Please fill all details"
        })
        return;
      }
      else{
        await axios.post("https://expense-tracker-room.onrender.com/userLogin" , { 
          email ,password
        })
          .then(async(res)=>{
            let {status , msg  , user} = res.data;
            console.log(user);
            if(status == "Success"){
              AsyncStorage.setItem('keepLogin', JSON.stringify(true));
               AsyncStorage.setItem('userName', user['username']);
               AsyncStorage.setItem('userEmail', user['email']);

              navigation.navigate("HomeScreen")
              // Toast.show({
              //   type:"success",
              //   text1:msg
              // })
            }
            else if(status ==  "failed"){
              Toast.show({
                type:"error",
                text1:msg
              })
            }
          }).catch((err)=>{
            console.error(err)
          })
      }
    }
    catch(err){
      console.error(err);
    }
  }


  return (    
    <View className="flex-1 bg-white " style={{backgroundColor: themeColors.bg}}>
      <SafeAreaView  className="flex mt-5">
        <View className="flex-row justify-start">
          {/* <TouchableOpacity onPress={()=> navigation.goBack()} 
            className="bg-yellow-400 p-2 mt-6 rounded-tr-2xl rounded-bl-2xl ml-4">
            <MaterialCommunityIcons name="arrow-left" color={"black"} size={26} />
          </TouchableOpacity> */}
        </View>
        <View  className="flex-row justify-center mb-4">
          <Image source={require('../assets/images/login.png')} 
          style={{width: 200, height: 200}} />
        </View>       
      </SafeAreaView>
      <View 
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}} 
        className="flex-1 bg-white px-8 pt-8">
          <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">Email Address</Text>
            <TextInput 
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              placeholder="email"
              value={email} 
              onChangeText={(text)=> setEmail(text)}

            />
            <Text className="text-gray-700 ml-4">Password</Text>
            <TextInput 
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
              secureTextEntry
              placeholder="password"
              value={password} 
              onChangeText={(text)=> setpassword(text)}
            />
            <TouchableOpacity className="flex items-end">
              <Text className="text-gray-700 mb-5">Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="py-3 bg-yellow-400 rounded-xl"
              onPress={handleLogin}
            >
                <Text 
                    className="text-xl font-bold text-center text-gray-700"
                >
                        Login
                </Text>
             </TouchableOpacity>
            
          </View>
          <Text className="text-xl text-gray-700 font-bold text-center py-5">Or</Text>
          <View className="flex-row justify-center space-x-12">
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
              <Image source={require('../assets/icons/google.png')} className="w-10 h-10" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
              <Image source={require('../assets/icons/apple.png')} className="w-10 h-10" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
              <Image source={require('../assets/icons/facebook.png')} className="w-10 h-10" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center mt-7">
              <Text className="text-gray-500 font-semibold">
                  Don't have an account?
              </Text>
              <TouchableOpacity onPress={()=> navigation.navigate('SignUp')}>
                  <Text className="font-semibold text-yellow-500"> Sign Up</Text>
              </TouchableOpacity>
          </View>
          <Toast />
      </View>
    </View>
    
  )
}