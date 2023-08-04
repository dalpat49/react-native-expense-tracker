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
import Appbar from "./Appbar";
import { List, Avatar, IconButton } from 'react-native-paper';
import {SelectList, MultipleSelectList }from 'react-native-dropdown-select-list'
import AsyncStorage from '@react-native-async-storage/async-storage';





// Define the task name for background notifications


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
  
  const [category, setCategory] = React.useState("");
  
  const data = [
    {key:'Khana', value:'Khana'},
    {key:'Bill', value:'Bill'},
    {key:'Mza', value:'Mza'},
    {key:'Tool', value:'Tool'},
    {key:'Electronic', value:'Electronic'},
    {key:'Kitchen product', value:'Kitchen product'},
  ]   

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



  const handleAddExpense = async () => {
    setAddBtnDisabled(true)
    // Perform validation and add the expense
    // Example:
    if (!description || !amount || !date || !category)  {
      Toast.show({
        type: "error",
        text1: "Please fill all details",
      });
      return;
    }

    let description1 = description;
    let amount1 = amount;
    let getcategory = category; 
    let userName =  await AsyncStorage.getItem('userName');    ;
    let savedate = date.toISOString().split('T')[0];

    setisDataAvailable(true);
    setIsUpdating(false);

    try {
      await axios
        .post("https://expense-tracker-room.onrender.com/getExpenses", {
          description1,
          amount1,
          savedate,
          userName,
          getcategory
        })
        .then((response) => {
        
          // Clear input fields
          let { status, msg } = response.data;

          if (status == "Success") {
            Toast.show({
              type: "success",
              text1: msg,
            });
            setisDataAvailable(false);
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
      setIsDeleting(false);
      let dlturl = "https://expense-tracker-room.onrender.com/deleteExpense/" + item;
      await axios
      .get(dlturl)
      .then((response) => {
        let { status, msg } = response.data;
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
          {
              return <>
                <Pressable onPress={() => onPressFunction(item._id)}>
                  <List.Item
                    // name  of particular 
                    title={item.description}
                    //category 
                    description={item.category}
                    titleStyle={styles.name}
                    descriptionStyle={styles.description}

                    right={() => (
                      <View style={styles.rightContainer}>
                        {/* amount  */}
                        <Text style={styles.price}>₹{item.amount}</Text>
                        {/* username */}
                        <Text style={styles.category}>{item.username}</Text>
                         {/* date  */}
                        <Text style={styles.date}>{item.savedDate}</Text>
                      </View>
                    )}
                    style={styles.listItem} />
                </Pressable>
                {isDeleting ? (
                  <Modal visible={isDeleting} transparent={true} animationType="fade">
                    <View style={styles.modalContainer}>
                      <View style={styles.contentContainer}>
                        <Text style={styles.title}>Delete Item</Text>
                        <Text style={styles.subtitle}>Are you sure.</Text>
                        <View style={styles.buttonArea}>
                          <TouchableOpacity style={styles.addButton} onPress={closeModal}>
                            <Text style={styles.buttonText}>Close</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.addButtonDlt} onPress={() => { deleteItem(YourId); } }>
                            <Text style={styles.buttonText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                ) : null}
              </>;
            }
        
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

                  <SelectList setSelected={setCategory} data={data}  style={{marginBottom: 8}} />

                  {/* <TextInput
                      style={styles.input}
                      placeholder="Particular"
                      value={description}
                      onChangeText={setDescription}
                    /> */}

                  <View  style={{flexDirection:"row" ,width:"100%" , marginTop:20}}>
                    <TextInput
                      style={styles.inputRow}
                      placeholder="Particular"
                      value={description}
                      onChangeText={setDescription}
                    />

                    <TextInput
                      style={styles.inputRow}
                      placeholder="Amount"
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                    />
{/* 
                    <TextInput
                      style={styles.inputRow}
                      placeholder="Your Name"
                      value={YourName}
                      onChangeText={SetYourName}
                    /> */}
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
  listItem: {
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: '#FFF',
  },
  avatar: {
    backgroundColor: '#FFAB91',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  description: {
    fontSize: 16,
    color: '#757575',
  },
  rightContainer: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  category: {
    fontSize: 16,
    color: '#3F51B5',
  },
  date: {
    fontSize: 14,
    color: '#757575',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
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
    marginTop:12,
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


