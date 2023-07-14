import React ,{ useState ,useEffect}from 'react';
import {
  StyleProp,
  ViewStyle,
  Animated,
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  SafeAreaView,
  I18nManager,
  FlatList,
  RefreshControl,
  Pressable,
  View,
  Modal,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import axios from "axios";
import { Input, Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from "react-native-toast-message";





const Personal = ({
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
  
}) => {
  const [isExtended, setIsExtended] = React.useState(true);
  const [expenses, setExpenses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [YourName, SetYourName] = useState("");




  const fetchExpenses = async () => {
    try {
     
      await axios
        .get("https://expense-tracker-room.onrender.com/expense")
        .then((res) => {
          const { status, data ,sum} = res.data;
          if (status === "success") {
            console.log(sum)
            setExpenses(data);
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

  //sending the data to db
  

  const handleAddExpense = async () => {
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
    let savedate = date.toISOString().split('T')[0];

    // setisDataAvailable(true);
    try {
      await axios
        .post("https://expense-tracker-room.onrender.com/userExpensesPOST", {
          description1,
          amount1,
          savedate,
        })
        .then((response) => {          
          // Clear input fields
          let { status, msg } = response.data;

          if (status == "Success") {
            Toast.show({
              type: "success",
              text1: msg,
            });
            // setisDataAvailable(false);
            setIsUpdating(false);
          }

          setDescription("");
          setAmount("");
          fetchExpenses();
        })
        .catch((error) => {
          console.log(error);
        });
      // Fetch updated expenses
    } catch (error) {
      console.error(error);
    }
  };

  //handling the refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchExpenses();
  };
  
  useEffect(() => {
    fetchExpenses()
  }, [])

  const openExpenseModal =() => {
    setIsUpdating(true)
  }

  const closeModalAddExpense =() => {
    setIsUpdating(false);
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
  
  const isIOS = Platform.OS === 'ios';

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { [animateFrom]: 16 };

  return (
    <>
      <Toast />
      <View style={styles.container}>
         <Text style={styles.titleMain}>Your Personal Expenses</Text>
            <SafeAreaView style={styles.container}>
            <FlatList
                onScroll={onScroll}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={expenses}
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
                ListEmptyComponent={<Text style={{textAlign:"center"}}>No Data available</Text>}
            />
            <AnimatedFAB
                icon={'plus'}
                extended={isExtended}
                onPress={openExpenseModal}
                visible={visible}
                animateFrom={'right'}
                label={'Add'}
                iconMode={'dynamic'}
                style={[styles.fabStyle, style, fabStyle]}
            />
            </SafeAreaView>

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

                        <TextInput
                            style={styles.input}
                            placeholder="Amount"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                        <View style={styles.buttonArea}>
                            <TouchableOpacity style={styles.addButtonForInput} onPress={closeModalAddExpense}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addButtonForInputAdd}  onPress={handleAddExpense}>
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </Modal>
            )}
        </View>
        </>
  );
};

export default Personal;

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  titleMain: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop:10,
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
    width:160,
    marginHorizontal:5
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
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