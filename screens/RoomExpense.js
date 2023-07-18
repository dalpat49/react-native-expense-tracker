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
import ConnectToInternetModal from "./ConnectToInternetModal";
import axios from "axios";
import Toast from "react-native-toast-message";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, Icon } from 'react-native-elements';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import Appbar from "./Appbar";

import * as BackgroundFetch from 'expo-background-fetch';
import { startBackgroundLocationTracking, stopBackgroundLocationTracking, BACKGROUND_LOCATION_TASK_NAME } from '../BackgroundTask';


// Define the task name for background notifications


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


const RoomExpense = () => {

  //variables
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [YourId, setYourId] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDataAvailable, setisDataAvailable] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [AddBtnDisabled, setAddBtnDisabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [YourName, SetYourName] = useState("");
  const [myDevice, setMyDevice] = useState("dalpat's Galaxy J6+");
  const [totalAmount, settotalAmount] = useState('0');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [tokenNew, settokenNew] = useState('');
  const [NewToken, setNewToken] = useState('');
  const [dlptToken, setdlptToken] = useState('');
  const [ajuToken, setauToken] = useState('');
  const [shktiToken, setshktiToken] = useState('');
  const [gotmTokan, setgotmTokan] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

     
    

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    registerForPushNotificationsAsync().then(token => settokenNew(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };

    // App startup
    async function appStartup() {
      // Register for push notifications
      const token = await registerForPushNotificationsAsync();
      console.log('Push notification token:', token);
    }

  }, []);

  useEffect(() => {
    // Set up the background fetch task
    const backgroundFetchTask = async (taskId) => {
      if (taskId === BACKGROUND_LOCATION_TASK_NAME) {
        console.log('Background fetch task triggered');
        // Start background location tracking
        startBackgroundLocationTracking();
        // Finish the background fetch task
        // BackgroundFetch.unregisterTaskAsync(taskId);
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


  // To unsubscribe to these update, just use:
  const fetchExpenses = async () => {
    try {
     
      await axios
        .get("https://expense-tracker-room.onrender.com/expense")
        .then((res) => {
          const { status, data ,sum} = res.data;
          if (status === "success") {
            console.log(sum)
            setExpenses(data);
            settotalAmount(sum)
            setisDataAvailable(false);
            setRefreshing(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  
    } catch (err) {
      alert(err);
    }
    
  };

  


  useEffect(() => {

    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected;
      setIsConnected(isConnected);
    });

    unsubscribe();
    //fetch al data
    fetchExpenses();
    // registerForPushNotificationsAsync()
  }, []);


  async function sendPushNotification(pushTokens,message) {
    // Retrieve the push tokens of all devices/users from your database
    // const pushTokens = []; // Replace with your own logic to get the tokens
  
    // Prepare the notification payload
    const notification = {
      to: pushTokens,
      sound: 'default',
      title: 'New Expense Added',
      body: message,
      data: { data: 'additional data' },
    };
  
    // Send the notification using Expo's push notification service
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });
  
    // Handle the response
    const result = await response.json();
    // console.log(result);
  }


  const handleAddExpense = async () => {
    setAddBtnDisabled(true)
    // Perform validation and add the expense
    // Example:
    if (!description || !amount || !date || !YourName)  {
      Toast.show({
        type: "error",
        text1: "Please fill all details",
      });
      return;
    }

    let description1 = description;
    let amount1 = amount;
    let userName = YourName;
    let savedate = date.toISOString().split('T')[0];

    setisDataAvailable(true);
    try {
      await axios
        .post("https://expense-tracker-room.onrender.com/getExpenses", {
          description1,
          amount1,
          savedate,
          userName
        })
        .then((response) => {
          sendPushNotification('ExponentPushToken[pJHPI5NTDlAJRUQLb6OqgU]',`${YourName} added ${description} to room expense`)
          // sendPushNotification('ExponentPushToken[pJHPI5NTDlAJRUQLb6OqgU]','getData from dalpat singh')
          // sendPushNotification('ExponentPushToken[pJHPI5NTDlAJRUQLb6OqgU]','getData from dalpat singh')
          // sendPushNotification('ExponentPushToken[pJHPI5NTDlAJRUQLb6OqgU]','getData from dalpat singh')
          // Clear input fields
          let { status, msg } = response.data;

          if (status == "Success") {
            Toast.show({
              type: "success",
              text1: msg,
            });
            setisDataAvailable(false);
            setIsUpdating(false);
          }

          setDescription("");
          setAmount("");
          SetYourName("");
          fetchExpenses();
          setAddBtnDisabled(false)
        })
        .catch((error) => {
          console.log(error);
        });
      // Fetch updated expenses
    } catch (error) {
      console.error(error);
    }
  };

  //add id 
  const onPressFunction = (item) => {
    setYourId(item)
    setIsDeleting(true);
  }

  //close modal
  const closeModal = () => {
    setIsDeleting(false)
  } 

  //delete 
  const deleteItem = async(item) =>{
    setisDataAvailable(true);
    
    if(Device.deviceName != myDevice){
      alert('sorry Only dalpat can delete the Data');
      setisDataAvailable(false);
      return;
    }
    else{
      let dlturl = "https://expense-tracker-room.onrender.com/deleteExpense/" + item;
      await axios
      .get(dlturl)
      .then((response) => {
        let { status, msg } = response.data;
        setIsDeleting(false);
        if (status == "success") {
          fetchExpenses();
          Toast.show({
            type: "success",
            text1: msg,
          });
          setisDataAvailable(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  }

  //show date picker
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  //hide date picker
  const hideDatePickerModal = () => {
    setShowDatePicker(false);
  };

  //calendra add date
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    hideDatePickerModal();
  };
  //handling the refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchExpenses();
  };
  
  const openExpenseModal =() => {
    setIsUpdating(true)
  }

  const closeModalAddExpense =() => {
    setIsUpdating(false);
  }

  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      setNewToken(token)
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
  
    return token;
  }
  return (
    <>
      <Appbar title={"Home"} />
      <View style={styles.container}>

        <ConnectToInternetModal visible={!isConnected} />
        <FlatList
          data={expenses}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => 
          <>
              <Pressable onPress={()=>onPressFunction(item._id)}>
                <View style={styles.containerData} >
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>[{item.username}]</Text>
                    <Text style={styles.descriptionText}>[{item.savedDate}] </Text>
                    <Text style={styles.descriptionText}>{item.description}</Text>
                  </View>
                  <Text style={styles.amountText}>₹{item.amount}</Text>
                </View>
            </Pressable>
        {isDeleting ?(
            <Modal visible={isDeleting} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.contentContainer}>
                <Text style={styles.title}>Delete Item</Text>
                <Text style={styles.subtitle}>Are you sure.</Text>
                  <View style={styles.buttonArea}>
                    <TouchableOpacity style={styles.addButton} onPress={closeModal}>
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButtonDlt} onPress={()=>{deleteItem(YourId)}}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </View>
            </Modal>
        ):null}
          </>
        
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListEmptyComponent={<Text style={{textAlign:"center"}}>Loading....</Text>}
        />
        <ActivityIndicator
          animating={isDataAvailable}
          size="large"
          color="#00ff00"
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        {isUpdating && (
          <Modal visible={isUpdating} transparent={true} animationType="slide ">
          <View style={styles.modalContainerForInput}>
              <View style={styles.contentContainerForInput}>
                  <Input
                    placeholder="Select Date"
                    value={date.toISOString().split('T')[0]}
                    onPress={showDatePickerModal}
                    editable={false}
                    rightIcon={
                      <Icon
                        type="font-awesome"
                        name="calendar"
                        size={25}
                        color="gray"
                        onPress={showDatePickerModal}
                      />
                    }
                  />  
                  <TextInput
                      style={styles.input}
                      placeholder="Description"
                      value={description}
                      onChangeText={setDescription}
                    />

                  <View  style={{flexDirection:"row" ,width:"100%"}}>

                    <TextInput
                      style={styles.inputRow}
                      placeholder="Amount"
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                    />

                    <TextInput
                      style={styles.inputRow}
                      placeholder="Your Name"
                      value={YourName}
                      onChangeText={SetYourName}
                    />
                  </View>
                  <View style={styles.buttonArea}>
                      <TouchableOpacity style={styles.addButtonForInput} onPress={closeModalAddExpense}>
                          <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addButtonForInputAdd}  onPress={handleAddExpense}>
                          <Text style={styles.buttonText} disabled={AddBtnDisabled}>Add</Text>
                        </TouchableOpacity>
                  </View>
              </View>
            </View>
          </Modal>
        )}

        <View style={styles.inputContainerTotal}>
          <Text style={{fontSize:20,marginTop:10,fontWeight:'bold'}}>Total = {totalAmount}</Text>
          <TouchableOpacity style={styles.addButtonAddExpense} onPress={openExpenseModal}>
            <Text style={styles.buttonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
        <Toast />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  titleMain: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerTotal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent:'space-between',
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputRow: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    width:"50%",
    marginHorizontal:1
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    width:"100%"
  },
  addButtonAdd: {
    backgroundColor: "#3366FF",
    borderRadius: 8,
    paddingVertical: 12,
  },
  addButtonAddExpense: {
    backgroundColor: "#3366FF",
    borderRadius: 8,
    paddingVertical: 12,
    width:200
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    width:"50%"
  },
  containerData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width:"100%"
  },
  descriptionContainer: {
    flex: 1,
    marginRight: 16,
    flexDirection:'row'
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3366FF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalContainerForInput: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding:10
    // alignItems: 'center',
  },
  contentContainerForInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    // alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: "#3366FF",
    width:100,
    marginVertical:6,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4
    
  },
  addButtonDlt: {
    backgroundColor: "red",
    width:100,
    marginVertical:6,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4
    
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonArea:{
    flexDirection: 'row',
    
  },
  addButtonForInput: {
    backgroundColor: "#3366FF",
    width:170,
    marginVertical:6,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4
    
  },
  addButtonForInputAdd: {
    backgroundColor: "red",
    width:170,
    marginVertical:6,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4
    
  },
});

export default RoomExpense;



// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//     setNewToken(token)
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }


//   return token;
// }


